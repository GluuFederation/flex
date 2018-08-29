/*
 * cred-manager is available under the MIT License (2008). See http://opensource.org/licenses/MIT for full text.
 *
 * Copyright (c) 2017, Gluu
 */
package org.gluu.casa.ui;

import org.gluu.casa.core.ExtensionsManager;
import org.gluu.casa.extension.navigation.MenuType;
import org.gluu.casa.extension.navigation.NavigationMenu;
import org.zkoss.util.Pair;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by jgomer on 2018-07-10.
 */
@Named
@ApplicationScoped
public class MenuService {

    @Inject
    private ExtensionsManager extManager;

    public List<Pair<String, NavigationMenu>> getMenusOfType(MenuType menuType) {

        return extManager.getPluginExtensionsForClass(NavigationMenu.class).stream()
                .filter(pair -> menuType.equals(pair.getY().menuType()))
                .map(pair -> new Pair<>(String.format("/%s/%s", ExtensionsManager.PLUGINS_EXTRACTION_DIR, pair.getX()), pair.getY()))
                .sorted(Comparator.comparing(pair -> -pair.getY().getPriority())).collect(Collectors.toList());

    }

}
