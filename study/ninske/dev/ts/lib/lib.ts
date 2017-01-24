interface PhaserPreload {
    preload(context:Context):void
}

interface PhaserLifeCycle extends PhaserPreload {
    create(context:Context):void
    update(context:Context):void
    render(context:Context):void
}