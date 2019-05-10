package org.gluu.casa.core.inmemory;

import org.gluu.service.cache.AbstractRedisProvider;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
 * @author jgomer
 */
public class RedisStoreWrapper implements InvocationHandler {

    private Object store;

    //private Logger logger = LoggerFactory.getLogger(getClass());

    public RedisStoreWrapper(AbstractRedisProvider store) {
        //It is assumed store implements methods found in IStoreService interface although it does not explicitly
        //implement that interface
        this.store = store;
    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Method realMethod = store.getClass().getDeclaredMethod(method.getName(), method.getParameterTypes());
        //logger.trace("Method to call: {} on {}", realMethod.getName(), store.getClass().getSimpleName());
        return realMethod.invoke(store, args);
    }

}
