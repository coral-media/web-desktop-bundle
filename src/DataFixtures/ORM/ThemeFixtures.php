<?php

namespace CoralMedia\Bundle\WebDesktopBundle\DataFixtures\ORM;

use CoralMedia\Bundle\WebDesktopBundle\DataFixtures\AppFixturesInterface;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Theme;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Yaml\Yaml;

class ThemeFixtures extends Fixture implements AppFixturesInterface, FixtureGroupInterface
{
    public function loadYamlData($className)
    {
        return Yaml::parse(
            file_get_contents(
                AppFixturesInterface::YAML_FILE_PATH .
                DIRECTORY_SEPARATOR . 'themes.yaml'
            )
        )['fixtures'][$className];
    }

    public function load(ObjectManager $manager)
    {
        $data = $this->loadYamlData(Theme::class);

        foreach ($data as $record) {
            $entity = new Theme();
            $entity->setName($record['name'])
                ->setAuthor($record['author'])
                ->setVersion($record['version'])
                ->setThumbnail($record['thumbnail'])
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
