<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Controller\Desktop;

use CoralMedia\Bundle\WebDesktopBundle\Service\DesktopManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class AbstractDesktopController extends AbstractController
{
    public static function getSubscribedServices(): array
    {
        return array_merge(parent::getSubscribedServices(), [
            'desktop.manager' => DesktopManager::class,
        ]);
    }
}
