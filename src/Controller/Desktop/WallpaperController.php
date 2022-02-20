<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Controller\Desktop;

use CoralMedia\Bundle\WebDesktopBundle\Entity\Wallpaper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class WallpaperController extends AbstractDesktopController
{
    /**
     * @Route("/wallpapers", name="desktop_wallpaper_get_all")
     */
    public function getAll()
    {
        $data = $this->getDoctrine()->getRepository(Wallpaper::class)
            ->findAll();
        $wallpapersPath = '/bundles/coralmediawebdesktop/desktop/resources/wallpapers';
        $responseData = [];
        /**
         * @var Wallpaper $wallpaper
         */
        foreach ($data as $wallpaper) {
            $item = [];
            $item['id'] = $wallpaper->getId();
            $item['name'] = $wallpaper->getName();
            $item['thumbnail'] = $wallpapersPath . '/thumbnails/' . $wallpaper->getFile();
            $item['file'] = $wallpaper->getFile();
            $responseData[] = $item;
        }

        return new JsonResponse([
            'success' => true,
            'wallpapers' => $responseData
        ]);
    }
}
