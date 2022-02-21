<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Controller\Desktop;

use CoralMedia\Bundle\WebDesktopBundle\Entity\Theme;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ThemeController extends AbstractDesktopController
{
    /**
     * @Route("/themes", name="desktop_theme_get_all")
     * @param Request $request
     * @param ManagerRegistry $managerRegistry
     * @return JsonResponse
     */
    public function getAll(Request $request, ManagerRegistry $managerRegistry)
    {
        $data = $managerRegistry->getRepository(Theme::class)
            ->findAll();
        $themeThumbnailPath = '/bundles/coralmediawebdesktop/desktop/resources/images';
        $responseData = [];
        /**
         * @var Theme $theme
         */
        foreach ($data as $theme) {
            $item = [];
            $item['id'] = $theme->getId();
            $item['name'] = $theme->getName();
            $item['thumbnail'] = $themeThumbnailPath . DIRECTORY_SEPARATOR . $theme->getThumbnail();
            $responseData[] = $item;
        }

        return new JsonResponse([
            'success' => true,
            'themes' => $responseData
        ]);
    }
}
