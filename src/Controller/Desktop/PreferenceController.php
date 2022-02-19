<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Controller\Desktop;

use CoralMedia\Bundle\WebDesktopBundle\Entity\Preference;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Theme;
use CoralMedia\Bundle\WebDesktopBundle\Entity\Wallpaper;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class PreferenceController extends AbstractDesktopController
{
    /**
     * @Route("/preference/save", name="desktop_preference_save")
     * @param Request $request
     * @return JsonResponse
     */
    public function save(Request $request)
    {
        /**
         * @var $userPreference Preference
         */
        $userPreference = $this->getDoctrine()->getRepository(Preference::class)
            ->findOneBy(['user' => $this->getUser()]);

        if ($request->get('method') === 'saveShortcut') {
            $userPreference->setModuleShortcut(json_decode($request->get('ids')));
        }

        if ($request->get('method') === 'saveAutorun') {
            $userPreference->setModuleAutorun(json_decode($request->get('ids')));
        }

        if ($request->get('method') === 'saveQuickstart') {
            $userPreference->setModuleQuickstart(json_decode($request->get('ids')));
        }

        if ($request->get('method') === 'saveAppearance') {
            $data = json_decode($request->get('data'), true);
            /**
             * @var $theme Theme
             */
            $theme = $this->getDoctrine()->getRepository(Theme::class)
                ->find($data['themeId']);

            $userPreference->setTaskbarTransparency($data['taskbarTransparency']);
            $userPreference->setFontColor($data['fontColor']);
            $userPreference->setTaskbarPosition($data['taskbarPosition']);
            $userPreference->setTheme($theme);
        }

        if ($request->get('method') === 'saveBackground') {
            $data = json_decode($request->get('data'), true);
            /**
             * @var $wallpaper Wallpaper
             */
            $wallpaper = $this->getDoctrine()->getRepository(Wallpaper::class)
                ->find($data['wallpaperId']);

            $userPreference->setBgColor($data['backgroundColor']);
            $userPreference->setWallpaperPosition($data['wallpaperPosition']);
            $userPreference->setWallpaper($wallpaper);

        }

        $this->getDoctrine()->getManager()->persist($userPreference);
        $this->getDoctrine()->getManager()->flush();

        return new JsonResponse(['success' => true]);
    }
}
