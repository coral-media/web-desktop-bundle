<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Entity;

use CoralMedia\Bundle\WebDesktopBundle\Repository\PreferenceRepository;
use CoralMedia\Bundle\SecurityBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PreferenceRepository::class)
 */
class Preference
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=16)
     */
    private $fontColor;

    /**
     * @ORM\Column(type="string", length=16)
     */
    private $bgColor;

    /**
     * @ORM\Column(type="string", length=16)
     */
    private $wallpaperPosition;

    /**
     * @ORM\Column(type="string", length=16)
     */
    private $taskbarPosition;

    /**
     * @ORM\Column(type="integer")
     */
    private $taskbarTransparency;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $moduleAutorun = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $moduleQuickstart = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $moduleShortcut = [];

    /**
     * @ORM\ManyToOne(targetEntity=Theme::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $theme;

    /**
     * @ORM\ManyToOne(targetEntity=Wallpaper::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $wallpaper;

    /**
     * @ORM\OneToOne(targetEntity=User::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=16)
     */
    private $taskbarButtonScale;

    /**
     * @ORM\Column(type="integer")
     */
    private $taskbarQuickstartWidth;

    /**
     * @ORM\Column(type="string", length=32)
     */
    private $taskbarButtonIconCls;

    /**
     * @ORM\Column(type="string", length=32, nullable=true)
     */
    private $taskbarButtonText;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFontColor(): ?string
    {
        return $this->fontColor;
    }

    public function setFontColor(string $fontColor): self
    {
        $this->fontColor = $fontColor;

        return $this;
    }

    public function getBgColor(): ?string
    {
        return $this->bgColor;
    }

    public function setBgColor(string $bgColor): self
    {
        $this->bgColor = $bgColor;

        return $this;
    }

    public function getWallpaperPosition(): ?string
    {
        return $this->wallpaperPosition;
    }

    public function setWallpaperPosition(string $wallpaperPosition): self
    {
        $this->wallpaperPosition = $wallpaperPosition;

        return $this;
    }

    public function getTaskbarPosition(): ?string
    {
        return $this->taskbarPosition;
    }

    public function setTaskbarPosition(string $taskbarPosition): self
    {
        $this->taskbarPosition = $taskbarPosition;

        return $this;
    }

    public function getTaskbarTransparency(): ?int
    {
        return $this->taskbarTransparency;
    }

    public function setTaskbarTransparency(int $taskbarTransparency): self
    {
        $this->taskbarTransparency = $taskbarTransparency;

        return $this;
    }

    public function getModuleAutorun(): ?array
    {
        return $this->moduleAutorun;
    }

    public function setModuleAutorun(?array $moduleAutorun): self
    {
        $this->moduleAutorun = $moduleAutorun;

        return $this;
    }

    public function getModuleQuickstart(): ?array
    {
        return $this->moduleQuickstart;
    }

    public function setModuleQuickstart(?array $moduleQuickstart): self
    {
        $this->moduleQuickstart = $moduleQuickstart;

        return $this;
    }

    public function getModuleShortcut(): ?array
    {
        return $this->moduleShortcut;
    }

    public function setModuleShortcut(?array $moduleShortcut): self
    {
        $this->moduleShortcut = $moduleShortcut;

        return $this;
    }

    public function getTheme(): ?Theme
    {
        return $this->theme;
    }

    public function setTheme(?Theme $theme): self
    {
        $this->theme = $theme;

        return $this;
    }

    public function getWallpaper(): ?Wallpaper
    {
        return $this->wallpaper;
    }

    public function setWallpaper(?Wallpaper $wallpaper): self
    {
        $this->wallpaper = $wallpaper;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getTaskbarButtonScale(): ?string
    {
        return $this->taskbarButtonScale;
    }

    public function setTaskbarButtonScale(string $taskbarButtonScale): self
    {
        $this->taskbarButtonScale = $taskbarButtonScale;

        return $this;
    }

    public function getTaskbarQuickstartWidth(): ?int
    {
        return $this->taskbarQuickstartWidth;
    }

    public function setTaskbarQuickstartWidth(int $taskbarQuickstartWidth): self
    {
        $this->taskbarQuickstartWidth = $taskbarQuickstartWidth;

        return $this;
    }

    public function getTaskbarButtonIconCls(): ?string
    {
        return $this->taskbarButtonIconCls;
    }

    public function setTaskbarButtonIconCls(string $taskbarButtonIconCls): self
    {
        $this->taskbarButtonIconCls = $taskbarButtonIconCls;

        return $this;
    }

    public function getTaskbarButtonText(): ?string
    {
        return $this->taskbarButtonText;
    }

    public function setTaskbarButtonText(?string $taskbarButtonText): self
    {
        $this->taskbarButtonText = $taskbarButtonText;

        return $this;
    }
}
