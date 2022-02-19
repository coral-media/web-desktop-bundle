<?php

namespace CoralMedia\Bundle\WebDesktopBundle\DataFixtures;

use Doctrine\Bundle\FixturesBundle\ORMFixtureInterface;

interface AppFixturesInterface extends ORMFixtureInterface
{
    public const YAML_FILE_PATH = __DIR__ . '/../Resources/config/fixtures';

    public function loadYamlData($className);
}
