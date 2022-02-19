<?php

namespace CoralMedia\Bundle\WebDesktopBundle\Entity;

use CoralMedia\Bundle\WebDesktopBundle\Repository\ModuleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ModuleRepository::class)
 */
class Module
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $jsid;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private $label;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $className;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $iconCls;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $shortcutIconCls;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private $tooltip;

    /**
     * @ORM\Column(type="string", length=64, nullable=true)
     */
    private $startMenuPath;

    /**
     * @ORM\Column(type="string", length=64, nullable=true)
     */
    private $contextMenuPath;

    /**
     * @ORM\Column(type="string", length=64, nullable=true)
     */
    private $startMenuToolPath;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hasResources;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getJsid(): ?string
    {
        return $this->jsid;
    }

    public function setJsid(string $jsid): self
    {
        $this->jsid = $jsid;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getClassName(): ?string
    {
        return $this->className;
    }

    public function setClassName(string $className): self
    {
        $this->className = $className;

        return $this;
    }

    public function getIconCls(): ?string
    {
        return $this->iconCls;
    }

    public function setIconCls(string $iconCls): self
    {
        $this->iconCls = $iconCls;

        return $this;
    }

    public function getShortcutIconCls(): ?string
    {
        return $this->shortcutIconCls;
    }

    public function setShortcutIconCls(string $shortcutIconCls): self
    {
        $this->shortcutIconCls = $shortcutIconCls;

        return $this;
    }

    public function getTooltip(): ?string
    {
        return $this->tooltip;
    }

    public function setTooltip(string $tooltip): self
    {
        $this->tooltip = $tooltip;

        return $this;
    }

    public function getStartMenuPath(): ?string
    {
        return $this->startMenuPath;
    }

    public function setStartMenuPath(?string $startMenuPath): self
    {
        $this->startMenuPath = $startMenuPath;

        return $this;
    }

    public function getContextMenuPath(): ?string
    {
        return $this->contextMenuPath;
    }

    public function setContextMenuPath(?string $contextMenuPath): self
    {
        $this->contextMenuPath = $contextMenuPath;

        return $this;
    }

    public function getStartMenuToolPath(): ?string
    {
        return $this->startMenuToolPath;
    }

    public function setStartMenuToolPath(?string $startMenuToolPath): self
    {
        $this->startMenuToolPath = $startMenuToolPath;

        return $this;
    }

    public function getHasResources(): ?bool
    {
        return $this->hasResources;
    }

    public function setHasResources(bool $hasResources): self
    {
        $this->hasResources = $hasResources;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }
}
