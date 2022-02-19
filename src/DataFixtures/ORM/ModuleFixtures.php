<?php

namespace CoralMedia\Bundle\WebDesktopBundle\DataFixtures\ORM;

use CoralMedia\Bundle\WebDesktopBundle\DataFixtures\AppFixturesInterface;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Module;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Yaml\Yaml;

class ModuleFixtures extends Fixture implements AppFixturesInterface
{
    public function loadYamlData($className)
    {
        return Yaml::parse(
            file_get_contents(
                AppFixturesInterface::YAML_FILE_PATH .
                DIRECTORY_SEPARATOR . 'modules.yaml'
            )
        )['fixtures'][$className];
    }

    public function load(ObjectManager $manager)
    {
        $data = $this->loadYamlData(Module::class);

        foreach ($data as $record) {
            $entity = new Module();
            $entity->setJsid($record['jsid'])
                ->setType($record['type'])
                ->setClassName($record['className'])
                ->setIconCls($record['iconCls'])
                ->setShortcutIconCls($record['shortcutIconCls'])
                ->setTooltip($record['tooltip'])
                ->setStartMenuPath($record['startMenuPath'])
                ->setContextMenuPath($record['contextMenuPath'])
                ->setStartMenuToolPath($record['startMenuToolPath'])
                ->setHasResources($record['hasResources'])
                ->setLabel($record['label'])
            ;

            $manager->persist($entity);
        }

        $manager->flush();
    }
}
