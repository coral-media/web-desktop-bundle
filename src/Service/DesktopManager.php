<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Service;

use CoralMedia\Bundle\WebDesktopBundle\Entity\Module;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Preference;
use CoralMedia\Bundle\WebDesktopBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

final class DesktopManager
{
    protected $em;
    protected $security;

    public function __construct(EntityManagerInterface $em, Security $security)
    {
        $this->em = $em;
        $this->security = $security;
    }

    public function hydrateModulesData()
    {
        $rawData = $this->em->getRepository(Module::class)
            ->findAll();
        $hydratedModuleData = [];
        /** @var Module $record */
        foreach ($rawData as $k => $record) {
            $hydratedModuleData[$k] = [
                'id' => $record->getJsid(),
                'type' => $record->getType(),
                'className' => $record->getClassName(),
                'hasResources' => $record->getHasResources(),
                'launcher' => [
                    'text' => $record->getLabel(),
                    'iconCls' => $record->getIconCls(),
                    'shortcutIconCls' => $record->getShortcutIconCls(),
                    'tooltip' => $record->getTooltip(),
                ],
                'launcherPaths' => [
                    'startmenu' => $record->getStartMenuPath(),
                    'contextmenu' => $record->getContextMenuPath(),
                    'startmenutool' => $record->getStartMenuToolPath()
                ]
            ];
        }

        return $hydratedModuleData;
    }

    public function hydrateDesktopConfig()
    {
        /**
         * @var Preference $rawData
         */
        $rawData = $this->em->getRepository(Preference::class)
            ->findOneBy(['user' => $this->security->getUser()]);

        if ($rawData === null) {
            $this->em->getRepository(Preference::class)
                ->findOneBy(['user' => null]);
        }

        $desktopConfig = new \stdClass();
        $theme = new \stdClass();
        $theme->id = $rawData->getTheme()->getId();
        $theme->name = $rawData->getTheme()->getName();

        $wallpaper = new \stdClass();
        $wallpaper->id = $rawData->getWallpaper()->getId();
        $wallpaper->name = $rawData->getWallpaper()->getName();
        $wallpaper->file = $rawData->getWallpaper()->getFile();

        $desktopConfig->appearance = new \stdClass();
        $desktopConfig->appearance->fontColor = $rawData->getFontColor();
        $desktopConfig->appearance->taskbarTransparency = $rawData->getTaskbarTransparency();
        $desktopConfig->appearance->theme = $theme;

        $desktopConfig->background = new \stdClass();
        $desktopConfig->background->color = $rawData->getBgColor();
        $desktopConfig->background->wallpaperPosition = $rawData->getWallpaperPosition();
        $desktopConfig->background->wallpaper = $wallpaper;

        $desktopConfig->launchers = new \stdClass();
        $desktopConfig->launchers->autorun = $rawData->getModuleAutorun();
        $desktopConfig->launchers->quickstart = $rawData->getModuleQuickstart();
        $desktopConfig->launchers->shortcut = $rawData->getModuleShortcut();

        $desktopConfig->taskbarConfig = new \stdClass();
        $desktopConfig->taskbarConfig
            ->buttonScale = $rawData->getTaskbarButtonScale();
        $desktopConfig->taskbarConfig
            ->position = $rawData->getTaskbarPosition();

        $desktopConfig->taskbarConfig
            ->quickstartConfig = new \stdClass();
        $desktopConfig->taskbarConfig
            ->quickstartConfig->width = $rawData->getTaskbarQuickstartWidth();

        $desktopConfig->taskbarConfig
            ->startButtonConfig = new \stdClass();
        $desktopConfig->taskbarConfig
            ->startButtonConfig->iconCls = $rawData->getTaskbarButtonIconCls();
        $desktopConfig->taskbarConfig
            ->startButtonConfig->text = $rawData->getTaskbarButtonText();

        $desktopConfig->taskbarConfig->startMenuConfig = new \stdClass();
        $desktopConfig->taskbarConfig->startMenuConfig->iconCls = 'icon-user-48';
        $desktopConfig->taskbarConfig->startMenuConfig->title = $this->security->getUser() ?? 'Anonymous';

        return $desktopConfig;
    }
}
