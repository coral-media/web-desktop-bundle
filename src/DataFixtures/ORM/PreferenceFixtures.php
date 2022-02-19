<?php

namespace CoralMedia\Bundle\WebDesktopBundle\DataFixtures\ORM;

use CoralMedia\Bundle\DemoBundle\DataFixtures\DemoFixtures;
use CoralMedia\Bundle\SecurityBundle\DataFixtures\SecurityFixtures;
use CoralMedia\Bundle\SecurityBundle\Entity\User;
use CoralMedia\Bundle\WebDesktopBundle\DataFixtures\AppFixturesInterface;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Preference;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Theme;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Wallpaper;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Yaml\Yaml;

class PreferenceFixtures extends Fixture implements AppFixturesInterface, DependentFixtureInterface
{
    public function loadYamlData($className)
    {
        return Yaml::parse(
            file_get_contents(
                AppFixturesInterface::YAML_FILE_PATH .
                DIRECTORY_SEPARATOR . 'preferences.yaml'
            )
        )['fixtures'][$className];
    }

    public function load(ObjectManager $manager)
    {
        $data = $this->loadYamlData(Preference::class);

        foreach ($data as $record) {
            $entity = new Preference();
            /**
             * @var User $user
             * @var Theme $theme
             * @var Wallpaper $wallpaper
             */
            $user = $this->getReference(sha1($record['user']));
            $theme = $this->getReference(sha1($record['theme']));
            $wallpaper = $this->getReference(sha1($record['wallpaper']));
            $entity->setUser($user)
                ->setTheme($theme)
                ->setWallpaper($wallpaper)
                ->setFontColor($record['fontColor'])
                ->setBgColor($record['bgColor'])
                ->setWallpaperPosition($record['wallpaperPosition'])
                ->setTaskbarPosition($record['taskbarPosition'])
                ->setTaskbarTransparency($record['taskbarTransparency'])
                ->setTaskbarButtonScale($record['taskbarButtonScale'])
                ->setTaskbarQuickstartWidth($record['taskbarQuickstartWidth'])
                ->setTaskbarButtonIconCls($record['taskbarButtonIconCls'])
                ->setTaskbarButtonText($record['taskbarButtonText'])
                ->setModuleAutorun($record['moduleAutorun'])
                ->setModuleQuickstart($record['moduleQuickstart'])
                ->setModuleShortcut($record['moduleShortcut'])
            ;
            $manager->persist($entity);
        }

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            ThemeFixtures::class,
            SecurityFixtures::class,
            DemoFixtures::class,
            WallpaperFixtures::class,
        ];
    }
}
