<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Controller\Desktop;

use Symfony\Component\Routing\Annotation\Route;

class DesktopController extends AbstractDesktopController
{
    /**
     * @Route("/", name="desktop_index")
     */
    public function index()
    {
        return $this->render('@CoralMediaWebDesktop/desktop/desktop/index.html.twig', [
            'modules' => $this->get('desktop.manager')->hydrateModulesData(),
            'desktopConfig' => $this->get('desktop.manager')->hydrateDesktopConfig()
        ]);
    }
}
