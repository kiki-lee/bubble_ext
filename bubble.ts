//% color=#32c4de icon="\uf192"
namespace bubble {

    let codingThisBall = 0
    let list: Image[] = []
    let burstBubble: Sprite = null
    let ShotNumber = 0
    let bonus = 0
    let totalBallsOut = 0
    let foundRoot = false
    let currentLocation: tiles.Location = null
    let locationsToClear: tiles.Location[] = []
    let lookingForTile: Image = null
    let clearCount = 0
    let locationQueue: tiles.Location[] = []
    let alreadyVisited: Image = null
    let aimingAngle = 0
    let myBall: Sprite = null


    /**
    * Appear to toss the bubble
    */
    //% blockId=tossBubble 
    //% block="toss bubble"
    //% help=bubble/toss_bubble
    export function tossBubble() {
        console.log("Preparing to toss: " + myBall.image.getPixel(4, 4))
        if (!(stateTransitions.stateIs("aiming"))) {
            return
        }
        stateTransitions.changeState("throwing")
        spriteutils.setVelocityAtAngle(myBall, spriteutils.degreesToRadians(aimingAngle), 300)
        sprites.setDataNumber(myBall, "vx", myBall.vx)
        sprites.setDataNumber(myBall, "vy", myBall.vy)
        console.log("Tossed: " + myBall.image.getPixel(4, 4))
    }



    function maybeAddToQueue(column: number, row: number) {
        if (alreadyVisited.getPixel(column, row) == 0) {
            locationQueue.push(tiles.getTileLocation(column, row))
            alreadyVisited.setPixel(column, row, 15)
        }
    }
    
    function checkForMatches(thisBall: Sprite) {
        console.log("Checking for Matches")
        if (tiles.tileAtLocationEquals(myBall.tilemapLocation(), assets.tile`myTile0`)) {
            game.gameOver(false)
        }
        console.log("Replacing ball with tile")
        sprites.destroy(thisBall)
        tiles.setTileAt(thisBall.tilemapLocation(), thisBall.image)
        tiles.setWallAt(thisBall.tilemapLocation(), true)
        alreadyVisited = image.create(20, 15)
        clearCount = 0
        lookingForTile = thisBall.image
        locationQueue = []
        locationsToClear = []
        maybeAddToQueue(thisBall.tilemapLocation().column, thisBall.tilemapLocation().row)
        alreadyVisited.drawRect(0, 0, 20, 15, 15)
        stateTransitions.changeState("scoring")
        timer.background(function () {
            while (locationQueue.length > 0) {
                currentLocation = locationQueue.removeAt(0)
                if (tileUtil.tileIs(tileUtil.currentTilemap(), currentLocation, lookingForTile)) {
                    locationsToClear.push(currentLocation)
                    maybeAddToQueue(currentLocation.column + 1, currentLocation.row + 0)
                    maybeAddToQueue(currentLocation.column - 1, currentLocation.row + 0)
                    maybeAddToQueue(currentLocation.column + 0, currentLocation.row + 1)
                    maybeAddToQueue(currentLocation.column + 0, currentLocation.row - 1)
                }
            }
            console.log("Found " + locationsToClear.length + " connections.")
            if (locationsToClear.length >= 3) {
                pause(100)
                for (let value of locationsToClear) {
                    clearLocation(value.column, value.row)
                    info.changeScoreBy(1)
                }
                info.changeScoreBy(Math.floor(1.5 ** locationsToClear.length) - 3)
                alreadyVisited.fill(0)
                alreadyVisited.drawRect(0, 0, 20, 15, 15)
                for (let indexX = 0; indexX <= 19; indexX++) {
                    for (let indexY = 0; indexY <= 14; indexY++) {
                        maybeAddToQueue(indexX, indexY)
                        if (locationQueue.length > 0) {
                            locationsToClear = []
                            while (locationQueue.length > 0) {
                                currentLocation = locationQueue.removeAt(0)
                                if (tiles.tileAtLocationIsWall(currentLocation)) {
                                    locationsToClear.push(currentLocation)
                                    maybeAddToQueue(currentLocation.column + 1, currentLocation.row + 0)
                                    maybeAddToQueue(currentLocation.column - 1, currentLocation.row + 0)
                                    maybeAddToQueue(currentLocation.column + 0, currentLocation.row + 1)
                                    maybeAddToQueue(currentLocation.column + 0, currentLocation.row - 1)
                                }
                            }
                            foundRoot = false
                            for (let value2 of locationsToClear) {
                                if (value2.row == 1) {
                                    foundRoot = true
                                    break;
                                }
                            }
                            if (!(foundRoot)) {
                                for (let value3 of locationsToClear) {
                                    clearLocation(value3.column, value3.row)
                                }
                            }
                        }
                    }
                }
            }
            console.log("Score = " + info.score())
            totalBallsOut = tiles.getTilesByType(assets.tile`myTile1`).length + (tiles.getTilesByType(assets.tile`myTile2`).length + (tiles.getTilesByType(assets.tile`myTile3`).length + (tiles.getTilesByType(assets.tile`myTile4`).length + tiles.getTilesByType(assets.tile`myTile5`).length)))
            if (totalBallsOut <= 0) {
                bonus = Math.round((120000 - game.runtime()) / 200)
                if (bonus > 0) {
                    game.setGameOverMessage(true, "Speed Bonus:" + bonus + " points!")
                    info.changeScoreBy(bonus)
                }
                game.gameOver(true)
            }
        })
        stateTransitions.changeState("aiming")
    }



    /**
    * Appear to aim further left
    */
    //% blockId=aimLeft 
    //% block="change angle left"
    //% help=bubble/aim_left
    export function tilt_angle_left() {
        if (stateTransitions.stateIs("aiming")) {
            aimingAngle = Math.constrain(aimingAngle - 1.5, -175, -5)
        }
    }

    /**
    * Appear to aim further right
    */
    //% blockId=aimRight 
    //% block="change angle right"
    //% help=bubble/aim_right
    export function tilt_angle_right() {
        if (stateTransitions.stateIs("aiming")) {
            aimingAngle = Math.constrain(aimingAngle + 1.5, -175, -5)
        }
    }


    
    
    function clearLocation(column: number, row: number) {
        burstBubble = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Player)
        tiles.placeOnTile(burstBubble, tiles.getTileLocation(column, row))
        if (tiles.tileAtLocationEquals(tiles.getTileLocation(column, row), assets.tile`myTile2`)) {
            animation.runImageAnimation(
                burstBubble,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 3 3 3 . . . . . . . 
            . . . . . 3 . . . 3 . . . . . . 
            . . . . 3 . . . . . 3 . . . . . 
            . . . . 3 . . . . . 3 . . . . . 
            . . . . 3 . . . . . 3 . . . . . 
            . . . . . 3 . . . 3 . . . . . . 
            . . . . . . 3 3 3 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 3 . . . . . . . . 
            . . . . 3 . . . . . 3 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 3 . . . . . . . 3 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . 3 . . . . . 3 . . . . . 
            . . . . . . . 3 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 3 . . . . . . . . 
            . . . 3 . . . . . . . 3 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 3 . . . . . . . . . 3 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 3 . . . . . . . 3 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 3 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 3 . . . . . . 3 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 3 . . . . . . . . 
            . 3 . . . . . . . . . . . 3 . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 3 . . . . . . . . . 3 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 3 . . . . . . . . 
            `],
                50,
                false
            )
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(column, row), assets.tile`myTile1`)) {
            animation.runImageAnimation(
                burstBubble,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 2 2 2 . . . . . . . 
            . . . . . 2 . . . 2 . . . . . . 
            . . . . 2 . . . . . 2 . . . . . 
            . . . . 2 . . . . . 2 . . . . . 
            . . . . 2 . . . . . 2 . . . . . 
            . . . . . 2 . . . 2 . . . . . . 
            . . . . . . 2 2 2 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 2 . . . . . . . . 
            . . . . 2 . . . . . 2 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 2 . . . . . . . 2 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . 2 . . . . . 2 . . . . . 
            . . . . . . . 2 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 2 . . . . . . . . 
            . . . 2 . . . . . . . 2 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 2 . . . . . . . . . 2 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 2 . . . . . . . 2 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 2 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 2 . . . . . . 2 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 2 . . . . . . . . 
            . 2 . . . . . . . . . . . 2 . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 2 . . . . . . . . . 2 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 2 . . . . . . . . 
            `],
                50,
                false
            )
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(column, row), assets.tile`myTile4`)) {
            animation.runImageAnimation(
                burstBubble,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 5 5 5 . . . . . . . 
            . . . . . 5 . . . 5 . . . . . . 
            . . . . 5 . . . . . 5 . . . . . 
            . . . . 5 . . . . . 5 . . . . . 
            . . . . 5 . . . . . 5 . . . . . 
            . . . . . 5 . . . 5 . . . . . . 
            . . . . . . 5 5 5 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 5 . . . . . . . . 
            . . . . 5 . . . . . 5 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 5 . . . . . . . 5 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . 5 . . . . . 5 . . . . . 
            . . . . . . . 5 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 5 . . . . . . . . 
            . . . 5 . . . . . . . 5 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 5 . . . . . . . . . 5 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 5 . . . . . . . 5 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 5 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 5 . . . . . . 5 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 5 . . . . . . . . 
            . 5 . . . . . . . . . . . 5 . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 5 . . . . . . . . . 5 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 5 . . . . . . . . 
            `],
                50,
                false
            )
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(column, row), assets.tile`myTile5`)) {
            animation.runImageAnimation(
                burstBubble,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 6 6 6 . . . . . . . 
            . . . . . 6 . . . 6 . . . . . . 
            . . . . 6 . . . . . 6 . . . . . 
            . . . . 6 . . . . . 6 . . . . . 
            . . . . 6 . . . . . 6 . . . . . 
            . . . . . 6 . . . 6 . . . . . . 
            . . . . . . 6 6 6 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 6 . . . . . . . . 
            . . . . 6 . . . . . 6 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 6 . . . . . . . 6 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . 6 . . . . . 6 . . . . . 
            . . . . . . . 6 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 6 . . . . . . . . 
            . . . 6 . . . . . . . 6 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 6 . . . . . . . . . 6 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 6 . . . . . . . 6 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 6 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 6 . . . . . . 6 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 6 . . . . . . . . 
            . 6 . . . . . . . . . . . 6 . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 6 . . . . . . . . . 6 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 6 . . . . . . . . 
            `],
                50,
                false
            )
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(column, row), assets.tile`myTile3`)) {
            animation.runImageAnimation(
                burstBubble,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 4 4 4 . . . . . . . 
            . . . . . 4 . . . 4 . . . . . . 
            . . . . 4 . . . . . 4 . . . . . 
            . . . . 4 . . . . . 4 . . . . . 
            . . . . 4 . . . . . 4 . . . . . 
            . . . . . 4 . . . 4 . . . . . . 
            . . . . . . 4 4 4 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 . . . . . . . . 
            . . . . 4 . . . . . 4 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 4 . . . . . . . 4 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . 4 . . . . . 4 . . . . . 
            . . . . . . . 4 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 . . . . . . . . 
            . . . 4 . . . . . . . 4 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 4 . . . . . . . . . 4 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 4 . . . . . . . 4 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 4 . . . . . . 4 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 . . . . . . . . 
            . 4 . . . . . . . . . . . 4 . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 4 . . . . . . . . . 4 . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 . . . . . . . . 
            `],
                50,
                false
            )
        } else {

        }
        burstBubble.lifespan = 150
        tiles.setTileAt(tiles.getTileLocation(column, row), assets.tile`transparency8`)
        tiles.setWallAt(tiles.getTileLocation(column, row), false)
        clearCount += 1
        music.play(music.createSoundEffect(
            WaveShape.Sawtooth,
            100 * clearCount,
            3000 + 500 * clearCount,
            255,
            0,
            100,
            SoundExpressionEffect.None,
            InterpolationCurve.Logarithmic
        ), music.PlaybackMode.UntilDone)
    }
    spriteutils.createRenderable(0, function (screen2) {
        if (stateTransitions.stateIs("aiming")) {
            for (let index = 0; index <= 4; index++) {
                screen2.setPixel(myBall.x + (index + 1) * 8 * Math.cos(spriteutils.degreesToRadians(aimingAngle)), myBall.y + (index + 1) * 8 * Math.sin(spriteutils.degreesToRadians(aimingAngle)), 11)
            }
        }
    })




    /**
    * Appear to load the bubble
    */
    //% blockId=loadBubble 
    //% block="load new bubble"
    //% help=bubble/load_bubble
    export function load_bubble() {
        pauseUntil(() => stateTransitions.stateIs("aiming"))
        if (totalBallsOut < 8) {
            console.log("UNDER 8")
            for (let value4 of list) {
                if (tiles.getTilesByType(value4).length == 0 && list.indexOf(value4) >= 0) {
                    console.log("No remaining " + value4)
                    list.removeAt(list.indexOf(value4))
                    console.log("Removed" + value4)
                } else if (tiles.getTilesByType(value4).length > 0 && list.indexOf(value4) < 0) {
                    console.log("There's a " + value4 + " left!")
                    list.push(value4)
                    console.log("Added" + value4)
                }
            }
        }
        console.log("" + list.length + " colors left in List")
        codingThisBall = randint(0, list.length - 1)
        ShotNumber += 1
        myBall = sprites.create(list[codingThisBall], SpriteKind.Ball)
        myBall.x = 80
        myBall.bottom = 112
        
        console.log("Lading Bubble: " + myBall.image.getPixel(4, 4))
    }


    /**
    * Set up the board grid
    */
    //% blockId=createBoard 
    //% block="arrange board"
    //% help=bubble/create_board
    export function createBoard() {
        tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`level0`))
        list = [
            assets.tile`myTile1`,
            assets.tile`myTile2`,
            assets.tile`myTile3`,
            assets.tile`myTile4`,
            assets.tile`myTile5`
        ]
        aimingAngle = -90
        for (let indexX2 = 0; indexX2 <= 17; indexX2++) {
            for (let indexY2 = 0; indexY2 <= 1; indexY2++) {
                tiles.setTileAt(tiles.getTileLocation(indexX2 + 1, indexY2 + 1), list._pickRandom())
                tiles.setWallAt(tiles.getTileLocation(indexX2 + 1, indexY2 + 1), true)
            }
        }
        controller.configureRepeatEventDefaults(0, 30)
        ShotNumber = 0
        stateTransitions.changeState("aiming")
    }











    /**
    * Decides where the bubble should stick
    * 
    */
    //% blockId=stick_to_wall
    //% block="stick $sprite to $location"
    //% sprite.shadow=variables_get
    //% sprite.defl=sprite
    //% location.defl=location
    export function stick_to_wall(sprite: Sprite, location: tiles.Location) {
        stateTransitions.changeState("checking")
        if (!(tiles.tileAtLocationEquals(location, assets.tile`myTile`))) {
            console.log("It hit something other than a brick tile...")
            if (tiles.tileAtLocationEquals(location, assets.tile`bottom_row`)) {
                console.log("It hit a ground tile.")
                sprites.destroy(sprite)
                info.changeScoreBy(-1)
            } else if (tiles.tileAtLocationIsWall(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom)) || tiles.tileAtLocationIsWall(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)) || tiles.tileAtLocationIsWall(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Top)) || tiles.tileAtLocationIsWall(sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left))) {
                console.log("It hit the edge of another ball.")
                sprite.setVelocity(0, 0)
                checkForMatches(sprite)
            } else {
                console.log("I'm not sure what it hit.")
                sprite.setVelocity(0, 0)
                sprite.y += -8
                checkForMatches(sprite)
            }
        } else {
            if (sprite.isHittingTile(CollisionDirection.Left)) {
                console.log("It hit the left wall")
                sprites.setDataNumber(myBall, "vx", Math.abs(sprites.readDataNumber(sprite, "vx")))
            }
            if (sprite.isHittingTile(CollisionDirection.Right)) {
                console.log("It hit the right wall")
                sprites.setDataNumber(myBall, "vx", 0 - Math.abs(sprites.readDataNumber(sprite, "vx")))
            }
            if (sprite.isHittingTile(CollisionDirection.Top)) {
                console.log("It hit the top wall")
                sprite.setVelocity(0, 0)
                checkForMatches(sprite)
            }
            if (sprite.isHittingTile(CollisionDirection.Bottom)) {
                console.log("It hit the bottom wall")
                sprites.setDataNumber(myBall, "vy", 0 - Math.abs(sprites.readDataNumber(sprite, "vy")))
            }
        }
    }
    
}
