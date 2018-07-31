package org.gluu.credmanager.rest;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A marker interface. Decorate your JAX-RS endpoints (eg classes annotated with <code>@javax.ws.rs.Path</code>) with this
 * annotation to make your endpoints added at runtime when the plugin they belong to is starting.
 * <p>By default it will be added as a singleton resource. If you want your class be instantiated upon every request,
 * supply the suitable parameter to the annotation</p>
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface RSResourceScope {

    /**
     * Whether the resource class will be instantiated only one time or once every request.
     * @return Boolean value
     */
    boolean singleton() default true;
}
