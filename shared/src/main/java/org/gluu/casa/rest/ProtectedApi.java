/*
 * casa is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2018, Gluu
 */
package org.gluu.casa.rest;

import javax.ws.rs.NameBinding;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotate a JAX-RS resource method with this annotation to make the endpoint protected. Clients hitting your endpoint
 * must pass a valid OAuth bearer token in the request header to have access. Example:
 * <pre>
 *
 * import javax.ws.rs.GET;
 * import javax.ws.rs.Path;
 *
 * {@literal @}Path("/library")
 * public class LibraryRestService {
 *
 *    {@literal @}GET
 *    {@literal @}Path("/books")
 *    {@literal @}ProtectedApi
 *    public String getBooks() {
 *        return ...
 *    }
 *
 * }
 * </pre>
 *
 * @author jgomer
 */
@NameBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface ProtectedApi {}
