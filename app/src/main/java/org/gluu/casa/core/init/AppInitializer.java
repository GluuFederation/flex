/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core.init;

import javassist.ClassClassPath;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtConstructor;
import javassist.CtField;
import javassist.CtMethod;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * This listener class can be removed when using a ZK CE version higher than 8.5.0. In this case, it suffices to uncomment
 * the corresponding library property in file zk.xml
 * @author jgomer
 */
//TODO: remove this class when using ZK CE > 8.5.0
@WebListener
public class AppInitializer implements ServletContextListener {

    @Inject
    private Logger logger;

    private static final String PATCH_1 = "public ClassLoader getContextClassLoaderForName(String className);";

    private static final String PATCH_2 = "private static org.zkoss.lang.ContextClassLoaderFactory factory;";

    private static final String PATCH_3 = "factory = (org.zkoss.lang.ContextClassLoaderFactory) "
            + "newInstanceByThread(org.zkoss.lang.Library.getProperty(\"org.zkoss.lang.contextClassLoader.class\"));";

    private static final String PATCH_4 = "public static ClassLoader getContextClassLoaderForName(String className) { "
            + "if (factory == null) "
            + "return Thread.currentThread().getContextClassLoader(); "
            + "return factory.getContextClassLoaderForName(className); "
            + "}";

    private static final String PATCH_5 = "{ "
            + "String clsName = toInternalForm($1); "
            + "final Class cls = org.zkoss.lang.Primitives.toClass(clsName); "
            + "if (cls != null) "
            + "    return cls; "
            + "ClassLoader cl = org.zkoss.lang.Library.getProperty(\"org.zkoss.lang.contextClassLoader.class\") == null "
            + "        ? Thread.currentThread().getContextClassLoader() "
            + "        : getContextClassLoaderForName(clsName); "
            + "if (cl != null) "
            + "    try { "
            + "        return Class.forName(clsName, true, cl); "
            + "    } catch (ClassNotFoundException ex) { "
            + "    } "
            + "return Class.forName(clsName); "
            + "}";

    public void contextInitialized(ServletContextEvent sce)  {

        //This method modifies a couple of ZK classes before they are loaded by the JVM. This is required to achieve a
        //fix for this problem: http://tracker.zkoss.org/browse/ZK-3762
        //In summary every cred-manager plugin is loaded in a separate Java classloader, meaning that ZK ViewModel classes
        //bound to zuml templates won't be found in current thread's classloader unless this problem is tackled.
        //The patching here is inspired in code of ZK 8.5.1 EE (https://github.com/zkoss/zk/tree/master/zcommon)

        //@developer: do not edit this method. You are warned :p
        logger.trace("AppInitializer. Applying ZK classes customization");

        System.setProperty("org.zkoss.lang.contextClassLoader.class", "org.gluu.casa.misc.CustomClassLoader");
        try {
            ClassPool pool = ClassPool.getDefault();
            pool.insertClassPath(new ClassClassPath(this.getClass()));

            logger.trace("AppInitializer. Patching org.zkoss.lang.ContextClassLoaderFactory");
            //Patch ZK's ContextClassLoaderFactory by adding new method
            CtClass ctLoaderFactory = pool.get("org.zkoss.lang.ContextClassLoaderFactory");
            CtMethod ctMethod = CtMethod.make(PATCH_1, ctLoaderFactory);
            ctLoaderFactory.addMethod(ctMethod);
            //Load the patched interface
            ctLoaderFactory.toClass();

            logger.trace("AppInitializer. Patching org.zkoss.lang.Classes");
            //Patch ZK's Classes
            CtClass ctClasses = pool.get("org.zkoss.lang.Classes");

            //Add factory field
            CtField f = CtField.make(PATCH_2, ctClasses);
            ctClasses.addField(f, "null");

            //Initialize field at constructor
            CtConstructor constructor = ctClasses.getClassInitializer();
            constructor.insertAfter(PATCH_3);

            //Add a getContextClassLoaderForName method to Classes class
            ctMethod = CtMethod.make(PATCH_4, ctClasses);
            ctClasses.addMethod(ctMethod);

            //Rewrite method forNameByThread
            ctMethod = ctClasses.getDeclaredMethod("forNameByThread");
            ctMethod.setBody(PATCH_5);

            //Load the patched class
            ctClasses.toClass();

            logger.trace("AppInitializer. Done");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            logger.warn("AppInitializer. Failure patching. UI pages of external plugins may not work properly");
        }

    }

    public void contextDestroyed(ServletContextEvent sce) {
    }

}
