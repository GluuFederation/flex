/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.core;

import org.gluu.casa.core.init.RSInitializer;
import org.gluu.casa.misc.Utils;
import org.gluu.casa.rest.RSResourceScope;
import org.jboss.resteasy.plugins.server.servlet.ResteasyContextParameters;
import org.jboss.resteasy.spi.Registry;
import org.jboss.resteasy.spi.ResteasyDeployment;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;

/**
 * @author jgomer
 */
@ApplicationScoped
public class RSRegistryHandler {

    private static final String ENDPOINTS_PREFIX = ExtensionsManager.PLUGINS_EXTRACTION_DIR;

    @Inject
    private Logger logger;

    @Inject
    private ServletContext servletContext;

    private Registry rsRegistry;

    private boolean enabled;

    private List<String> skipFolders;

    private Map<String, List<Class<?>>> registeredResources;

    @SuppressWarnings("unchecked")
    @PostConstruct
    private void inited() {
        try {
            skipFolders = Arrays.asList(ZKService.EXTERNAL_LABELS_DIR, ExtensionsManager.ASSETS_DIR, "META-INF");
            registeredResources = new HashMap<>();

            //Try to find a ResteasyDeployment
            Object obj = servletContext.getAttribute(Registry.class.getName());
            //sc.getAttribute(ResteasyDeployment.class.getName())

            if (obj == null) {
                obj = servletContext.getAttribute(ResteasyContextParameters.RESTEASY_DEPLOYMENTS);
                Map<String, ResteasyDeployment> deployments = (Map<String, ResteasyDeployment>) obj;
                rsRegistry = deployments.get(RSInitializer.ROOT_PATH).getRegistry();
            } else {
                rsRegistry = ((ResteasyDeployment) obj).getRegistry();
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (rsRegistry == null) {
                logger.warn("Could not access RestEasy registry. Addition of REST services at runtime may not be available");
            } else {
                logger.info("RestEasy registry is accessible. Addition of REST services at runtime will be available");
                enabled = true;
            }
        }
        //registry.removeRegistrations(RestService2.class);

    }

    private boolean processClassEntry(String id, String binaryName, ClassLoader clsLoader, List<Class<?>> list) {

        boolean added = false;
        try {
            Class<?> cls = clsLoader.loadClass(binaryName);
            javax.ws.rs.Path pathAnnotation = cls.getAnnotation(javax.ws.rs.Path.class);

            if (pathAnnotation != null) {
                logger.info("Found class '{}' annotated with @Path", binaryName);
                String basePath = ENDPOINTS_PREFIX + "/" + id;
                String absolutePath = RSInitializer.ROOT_PATH + "/" + basePath + pathAnnotation.value();

                RSResourceScope scopeAnnotation = cls.getAnnotation(RSResourceScope.class);
                boolean isSingleton =  scopeAnnotation == null || scopeAnnotation.singleton();

                if (isSingleton) {
                    try {
                        rsRegistry.addSingletonResource(cls.newInstance(), basePath);
                        logger.info("Singleton resource has been bound to '{}' endpoint", absolutePath);
                        list.add(cls);
                        added = true;
                    } catch (Exception e) {
                        logger.error("Class could not be instantiated. Check it has no args constructor");
                    }
                } else {
                    rsRegistry.addPerRequestResource(cls, basePath);
                    logger.info("Per-request resource has been bound to '{}' endpoint", absolutePath);
                    list.add(cls);
                    added = true;
                }
            }

        } catch (ClassNotFoundException e) {
            //Intentionally left empty
        }
        return added;

    }

    private int scanJarForRSResources(String id, JarInputStream inStream, ClassLoader clsLoader) throws IOException {

        int count = 0;
        JarEntry entry = inStream.getNextJarEntry();

        for (; entry != null; entry = inStream.getNextJarEntry()) {
            final String entryName = entry.getName();

            if (!entry.isDirectory() && entryName.endsWith(".class")
                    && skipFolders.stream().noneMatch(skip -> entryName.startsWith(skip + "/"))) {

                String binaryName = entryName.replace("/", ".");
                binaryName = binaryName.substring(0, binaryName.length() - ".class".length());
                count += processClassEntry(id, binaryName, clsLoader, registeredResources.get(id)) ? 1 : 0;
            }
        }
        return count;

    }

    private int scanFolderForRSResources(String id, Path start, ClassLoader clsLoader) throws IOException {

        final class MyCounterFileVisitor extends SimpleFileVisitor<Path> {

            private int count = 0;
            private int offset;

            private MyCounterFileVisitor(String basePath) {
                this.offset = basePath.length() + 1;    //Add one because trailing (back)slash is not in basePath
            }

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {

                String path = file.toString().substring(offset);
                if (Utils.isClassFile(file) && skipFolders.stream().noneMatch(skip -> path.startsWith(skip + File.separator))) {
                    String binaryName = path.startsWith("classes" + File.separator) ? path.substring("classes".length() + 1) : path;
                    binaryName = binaryName.replace(File.separator, ".");
                    binaryName = binaryName.substring(0, binaryName.length() - ".class".length());
                    count += processClassEntry(id, binaryName, clsLoader, registeredResources.get(id)) ? 1 : 0;
                }
                return FileVisitResult.CONTINUE;
            }

        }

        MyCounterFileVisitor visitor = new MyCounterFileVisitor(start.toString());
        Files.walkFileTree(start, visitor);
        return visitor.count;

    }

    public void scan(String id, Path path, ClassLoader classLoader) {

        int scannedResources = 0;

        if (enabled) {
            try {
                registeredResources.put(id, new ArrayList<>());
                //Recursively scan for @Path annotation in directory (or jar file)
                if (Files.isDirectory(path)) {
                    scannedResources = scanFolderForRSResources(id, path, classLoader);
                } else if (Utils.isJarFile(path)) {
                    try (JarInputStream jis = new JarInputStream(new BufferedInputStream(new FileInputStream(path.toString())), false)) {
                        scannedResources = scanJarForRSResources(id, jis, classLoader);
                    }
                }
            } catch (IOException e) {
                logger.error("Error scanning RestEasy resources: {}", e.getMessage());
            }
            logger.info("{} RestEasy resource class(es) registered", scannedResources);

        } else {
            logger.info("Path '{}' will not be scanned: no RestEasy registry was found", path.toString());
        }
    }

    public void remove(String id) {

        if (enabled) {
            List<Class<?>> classes = registeredResources.get(id);
            if (classes != null) {
                for (Class<?> cls : classes) {
                    logger.debug("Removing RestEasy registration {}", cls.getName());
                    rsRegistry.removeRegistrations(cls, ENDPOINTS_PREFIX + "/" + id);
                }
                registeredResources.remove(id);
            }
        }

    }

}
