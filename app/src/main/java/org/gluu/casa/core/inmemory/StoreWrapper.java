package org.gluu.casa.core.inmemory;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
 * @author jgomer
 */
public class StoreWrapper implements InvocationHandler {

    private Object store;

    //private Logger logger = LoggerFactory.getLogger(getClass());

    public StoreWrapper(Object store) {
        //It is assumed store object implements all IStoreService methods despite it does not explicitly
        //implement such interface
        this.store = store;
    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Method realMethod = store.getClass().getDeclaredMethod(method.getName(), method.getParameterTypes());
        //logger.trace("Method to call: {} on {}", realMethod.getName(), store.getClass().getSimpleName());
        return realMethod.invoke(store, args);
    }

}
