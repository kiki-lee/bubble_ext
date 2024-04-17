// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency26 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency28 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level2":
            case "level2":return tiles.createTilemap(hex`14000f00010101010101010101010101010101010101010101000000000000000000000000000000000000010100000000000000000000000000000000000001010000000000000000000000000000000000000101000000000000000000000000000000000000010100000000000000000000000000000000000001010000000000000000000000000000000000000101000000000000000000000000000000000000010100000000000000000000000000000000000001010000000000000000000000000000000000000101000000000000000000000000000000000000010102020202020202020202020202020202020201010000000000000000000000000000000000000101000000000000000000000000000000000000010101010101010101010101010101010101010101`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency28,myTiles.tile1,myTiles.tile2], TileScale.Eight);
            case "level0":
            case "level5":return tiles.createTilemap(hex`14000f00010101010101010101010101010101010101010101000000000000000000000000000000000000010100000000000000000000000000000000000001010000000000000000000000000000000000000101000000000000000000000000000000000000010100000000000000000000000000000000000001010000000000000000000000000000000000000101000000000000000000000000000000000000010100000000000000000000000000000000000001010000000000000000000000000000000000000101000000000000000000000000000000000000010102020202020202020202020202020202020201010000000000000000000000000000000000000101000000000000000000000000000000000000010103030303030303030303030303030303030301`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . . . 2 
`, [myTiles.transparency28,myTiles.tile1,myTiles.tile2,myTiles.tile9], TileScale.Eight);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency26":return transparency26;
            case "transparency28":return transparency28;
            case "myTile":
            case "tile1":return tile1;
            case "myTile2":
            case "tile4":return tile4;
            case "myTile3":
            case "tile5":return tile5;
            case "myTile4":
            case "tile6":return tile6;
            case "myTile5":
            case "tile7":return tile7;
            case "bottom_row":
            case "tile9":return tile9;
            case "myTile1":
            case "tile3":return tile3;
            case "myTile0":
            case "tile2":return tile2;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
