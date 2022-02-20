<?php

namespace CoralMedia\Bundle\WebDesktopBundle\DataFixtures\ORM;

use CoralMedia\Bundle\WebDesktopBundle\DataFixtures\AppFixturesInterface;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Wallpaper;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Yaml\Yaml;

class WallpaperFixtures extends Fixture implements AppFixturesInterface, FixtureGroupInterface
{
    public function loadYamlData($className)
    {
        return Yaml::parse(
            file_get_contents(
                AppFixturesInterface::YAML_FILE_PATH .
                DIRECTORY_SEPARATOR . 'wallpapers.yaml'
            )
        )['fixtures'][$className];
    }

    public function load(ObjectManager $manager)
    {
        $data = $this->loadYamlData(Wallpaper::class);

        foreach ($data as $record) {
            $entity = new Wallpaper();
            $entity->setName($record['name'])
                ->setFile($record['file'])
                ->setActive($record['active'])
            ;

            $manager->persist($entity);

            $this->addReference(sha1($entity->getName()), $entity);
        }

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['WebDesktop'];
    }
}
