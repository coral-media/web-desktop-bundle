<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Controller\Desktop;

use CoralMedia\Bundle\WebDesktopBundle\Service\DesktopManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class DesktopController extends AbstractDesktopController
{
    /**
     * @Route("/", name="desktop_index")
     * @param DesktopManager $desktopManager
     * @return Response
     */
    public function index(DesktopManager $desktopManager): Response
    {
        return $this->render('@CoralMediaWebDesktop/desktop/desktop/index.html.twig', [
            'modules' => $desktopManager->hydrateModulesData(),
            'desktopConfig' => $desktopManager->hydrateDesktopConfig()
        ]);
    }

    /**
     * @Route("/login", name="desktop_login")
     * @param AuthenticationUtils $authenticationUtils
     * @return Response
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render(
            '@CoralMediaWebDesktop/security/login.html.twig',
            ['last_username' => $lastUsername, 'error' => $error]
        );
    }

    /**
     * @Route("/logout", name="desktop_logout")
     * @return Response
     */
    public function logout()
    {
        return $this->redirectToRoute('desktop_login');
    }
}
