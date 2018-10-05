import * as Long from 'long';
import { Utils } from './GameUtils';
import { IBoardProps } from '../components/Board/Board';

export interface IGameState {
    initGame(): void;
    loadGame(board: IBoardProps): void;
    getIsWhiteMove(): boolean;
    setIsWhiteMove(isWhiteMove: boolean): void;
    getPiece(pos: number): string | null;
    getFutureMove(pos: number): number[];
    move(initPos: number, endPos: number): void;
    isCheck(isWhite?: boolean): boolean;
    isCheckMate(isWhite?: boolean): boolean;
    isTable(isWhite?: boolean): boolean;
    updateState(isWhiteMove: boolean): void;
    coronate(piece: string): void;
    coronation?: string;
    W_ROOKS: Long;
    W_KNIGHTS: Long;
    W_BISHOPS: Long;
    W_QUEENS: Long;
    W_KING: Long;
    W_PAWNS: Long;
    B_ROOKS: Long;
    B_KNIGHTS: Long;
    B_BISHOPS: Long;
    B_QUEENS: Long;
    B_KING: Long;
    B_PAWNS: Long;
}

export class BitGameState implements IGameState {
    private _isWhiteMove: boolean;
    
    public getIsWhiteMove(): boolean {
        return this._isWhiteMove;
    }
    setIsWhiteMove(isWhiteMove: boolean) {
        this._isWhiteMove = isWhiteMove;
        this.updateState(isWhiteMove);
    }
    private toggle() {
        this._isWhiteMove = !this._isWhiteMove;
        this.updateState(this._isWhiteMove);
    }

    public W_ROOKS = Long.fromInt(0);
    public W_KNIGHTS = Long.fromInt(0);
    public W_BISHOPS = Long.fromInt(0);
    public W_QUEENS = Long.fromInt(0);
    public W_KING = Long.fromInt(0);
    public W_PAWNS = Long.fromInt(0);
    public B_ROOKS = Long.fromInt(0);
    public B_KNIGHTS = Long.fromInt(0);
    public B_BISHOPS = Long.fromInt(0);
    public B_QUEENS = Long.fromInt(0);
    public B_KING = Long.fromInt(0);
    public B_PAWNS = Long.fromInt(0);

    public static W_ROOKS_CHAR = 'r';
    public static W_KNIGHTS_CHAR = 'n';
    public static W_BISHOPS_CHAR = 'b';
    public static W_QUEENS_CHAR = 'q';
    public static W_KING_CHAR = 'k';
    public static W_PAWNS_CHAR = 'p';
    public static B_ROOKS_CHAR = 'R';
    public static B_KNIGHTS_CHAR = 'N';
    public static B_BISHOPS_CHAR = 'B';
    public static B_QUEENS_CHAR = 'Q';
    public static B_KING_CHAR = 'K';
    public static B_PAWNS_CHAR = 'P';

    private PAWN_PASSANT = Long.fromInt(0);

    private static KING_MOVES = ["770", "1797", "3594", "7188", "14376", "28752", "57504", "49216", "197123", "460039", "920078", "1840156", "3680312", "7360624", "14721248", "12599488", "50463488", "117769984", "235539968", "471079936", "942159872", "1884319744", "3768639488", "3225468928", "12918652928", "30149115904", "60298231808", "120596463616", "241192927232", "482385854464", "964771708928", "825720045568", "3307175149568", "7718173671424", "15436347342848", "30872694685696", "61745389371392", "123490778742784", "246981557485568", "211384331665408", "846636838289408", "1975852459884544", "3951704919769088", "7903409839538176", "15806819679076352", "31613639358152704", "63227278716305408", "54114388906344448", "216739030602088448", "505818229730443264", "1011636459460886528", "2023272918921773056", "4046545837843546112", "8093091675687092224", "16186183351374184448", "13853283560024178688", "144959613005987840", "362258295026614272", "724516590053228544", "1449033180106457088", "2898066360212914176", "5796132720425828352", "11592265440851656704", "4665729213955833856"].map((item) => Long.fromString(item));
    private static KNIGHT_MOVES = ["132096", "329728", "659712", "1319424", "2638848", "5277696", "10489856", "4202496", "33816580", "84410376", "168886289", "337772578", "675545156", "1351090312", "2685403152", "1075839008", "8657044482", "21609056261", "43234889994", "86469779988", "172939559976", "345879119952", "687463207072", "275414786112", "2216203387392", "5531918402816", "11068131838464", "22136263676928", "44272527353856", "88545054707712", "175990581010432", "70506185244672", "567348067172352", "1416171111120896", "2833441750646784", "5666883501293568", "11333767002587136", "22667534005174272", "45053588738670592", "18049583422636032", "145241105196122112", "362539804446949376", "725361088165576704", "1450722176331153408", "2901444352662306816", "5802888705324613632", "11533718717099671552", "4620693356194824192", "288234782788157440", "576469569871282176", "1224997833292120064", "2449995666584240128", "4899991333168480256", "9799982666336960512", "1152939783987658752", "2305878468463689728", "1128098930098176", "2257297371824128", "4796069720358912", "9592139440717824", "19184278881435648", "38368557762871296", "4679521487814656", "9077567998918656"].map((item) => Long.fromString(item));
    private static W_PAWN_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "65536", "131072", "262144", "524288", "1048576", "2097152", "4194304", "8388608", "16777216", "33554432", "67108864", "134217728", "268435456", "536870912", "1073741824", "2147483648", "4294967296", "8589934592", "17179869184", "34359738368", "68719476736", "137438953472", "274877906944", "549755813888", "1099511627776", "2199023255552", "4398046511104", "8796093022208", "17592186044416", "35184372088832", "70368744177664", "140737488355328", "281474976710656", "562949953421312", "1125899906842624", "2251799813685248", "4503599627370496", "9007199254740992", "18014398509481984", "36028797018963968", "72057594037927936", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "9223372036854775808", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static B_PAWN_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024", "2048", "4096", "8192", "16384", "32768", "65536", "131072", "262144", "524288", "1048576", "2097152", "4194304", "8388608", "16777216", "33554432", "67108864", "134217728", "268435456", "536870912", "1073741824", "2147483648", "4294967296", "8589934592", "17179869184", "34359738368", "68719476736", "137438953472", "274877906944", "549755813888", "1099511627776", "2199023255552", "4398046511104", "8796093022208", "17592186044416", "35184372088832", "70368744177664", "140737488355328", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static W_PAWN_TWO_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "16777216", "33554432", "67108864", "134217728", "268435456", "536870912", "1073741824", "2147483648", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static B_PAWN_TWO_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "4294967296", "8589934592", "17179869184", "34359738368", "68719476736", "137438953472", "274877906944", "549755813888", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static W_PAWN_ATTACK = ["0", "0", "0", "0", "0", "0", "0", "0", "131072", "327680", "655360", "1310720", "2621440", "5242880", "10485760", "4194304", "33554432", "83886080", "167772160", "335544320", "671088640", "1342177280", "2684354560", "1073741824", "8589934592", "21474836480", "42949672960", "85899345920", "171798691840", "343597383680", "687194767360", "274877906944", "2199023255552", "5497558138880", "10995116277760", "21990232555520", "43980465111040", "87960930222080", "175921860444160", "70368744177664", "562949953421312", "1407374883553280", "2814749767106560", "5629499534213120", "11258999068426240", "22517998136852480", "45035996273704960", "18014398509481984", "144115188075855872", "360287970189639680", "720575940379279360", "1441151880758558720", "2882303761517117440", "5764607523034234880", "11529215046068469760", "4611686018427387904", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static B_PAWN_ATTACK = ["0", "0", "0", "0", "0", "0", "0", "0", "2", "5", "10", "20", "40", "80", "160", "64", "512", "1280", "2560", "5120", "10240", "20480", "40960", "16384", "131072", "327680", "655360", "1310720", "2621440", "5242880", "10485760", "4194304", "33554432", "83886080", "167772160", "335544320", "671088640", "1342177280", "2684354560", "1073741824", "8589934592", "21474836480", "42949672960", "85899345920", "171798691840", "343597383680", "687194767360", "274877906944", "2199023255552", "5497558138880", "10995116277760", "21990232555520", "43980465111040", "87960930222080", "175921860444160", "70368744177664", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static FULLBOARD = Long.fromString("18446744073709551615");

    private static RIGHT_MOVES = ["254", "252", "248", "240", "224", "192", "128", "0", "65024", "64512", "63488", "61440", "57344", "49152", "32768", "0", "16646144", "16515072", "16252928", "15728640", "14680064", "12582912", "8388608", "0", "4261412864", "4227858432", "4160749568", "4026531840", "3758096384", "3221225472", "2147483648", "0", "1090921693184", "1082331758592", "1065151889408", "1030792151040", "962072674304", "824633720832", "549755813888", "0", "279275953455104", "277076930199552", "272678883688448", "263882790666240", "246290604621824", "211106232532992", "140737488355328", "0", "71494644084506624", "70931694131085312", "69805794224242688", "67553994410557440", "63050394783186944", "54043195528445952", "36028797018963968", "0", "18302628885633695744", "18158513697557839872", "17870283321406128128", "17293822569102704640", "16140901064495857664", "13835058055282163712", "9223372036854775808", "0"].map((item) => Long.fromString(item));
    private static LEFT_MOVES = ["0", "1", "3", "7", "15", "31", "63", "127", "0", "256", "768", "1792", "3840", "7936", "16128", "32512", "0", "65536", "196608", "458752", "983040", "2031616", "4128768", "8323072", "0", "16777216", "50331648", "117440512", "251658240", "520093696", "1056964608", "2130706432", "0", "4294967296", "12884901888", "30064771072", "64424509440", "133143986176", "270582939648", "545460846592", "0", "1099511627776", "3298534883328", "7696581394432", "16492674416640", "34084860461056", "69269232549888", "139637976727552", "0", "281474976710656", "844424930131968", "1970324836974592", "4222124650659840", "8725724278030336", "17732923532771328", "35747322042253312", "0", "72057594037927936", "216172782113783808", "504403158265495552", "1080863910568919040", "2233785415175766016", "4539628424389459968", "9151314442816847872"].map((item) => Long.fromString(item));
    private static UP_MOVES = ["72340172838076672", "144680345676153344", "289360691352306688", "578721382704613376", "1157442765409226752", "2314885530818453504", "4629771061636907008", "9259542123273814016", "72340172838076416", "144680345676152832", "289360691352305664", "578721382704611328", "1157442765409222656", "2314885530818445312", "4629771061636890624", "9259542123273781248", "72340172838010880", "144680345676021760", "289360691352043520", "578721382704087040", "1157442765408174080", "2314885530816348160", "4629771061632696320", "9259542123265392640", "72340172821233664", "144680345642467328", "289360691284934656", "578721382569869312", "1157442765139738624", "2314885530279477248", "4629771060558954496", "9259542121117908992", "72340168526266368", "144680337052532736", "289360674105065472", "578721348210130944", "1157442696420261888", "2314885392840523776", "4629770785681047552", "9259541571362095104", "72339069014638592", "144678138029277184", "289356276058554368", "578712552117108736", "1157425104234217472", "2314850208468434944", "4629700416936869888", "9259400833873739776", "72057594037927936", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "9223372036854775808", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static DOWN_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "4", "8", "16", "32", "64", "128", "257", "514", "1028", "2056", "4112", "8224", "16448", "32896", "65793", "131586", "263172", "526344", "1052688", "2105376", "4210752", "8421504", "16843009", "33686018", "67372036", "134744072", "269488144", "538976288", "1077952576", "2155905152", "4311810305", "8623620610", "17247241220", "34494482440", "68988964880", "137977929760", "275955859520", "551911719040", "1103823438081", "2207646876162", "4415293752324", "8830587504648", "17661175009296", "35322350018592", "70644700037184", "141289400074368", "282578800148737", "565157600297474", "1130315200594948", "2260630401189896", "4521260802379792", "9042521604759584", "18085043209519168", "36170086419038336"].map((item) => Long.fromString(item));

    private static D45_MOVES = ["9241421688590303744", "36099303471055872", "141012904183808", "550831656960", "2151686144", "8404992", "32768", "0", "4620710844295151616", "9241421688590303232", "36099303471054848", "141012904181760", "550831652864", "2151677952", "8388608", "0", "2310355422147510272", "4620710844295020544", "9241421688590041088", "36099303470530560", "141012903133184", "550829555712", "2147483648", "0", "1155177711056977920", "2310355422113955840", "4620710844227911680", "9241421688455823360", "36099303202095104", "141012366262272", "549755813888", "0", "577588851233521664", "1155177702467043328", "2310355404934086656", "4620710809868173312", "9241421619736346624", "36099165763141632", "140737488355328", "0", "288793326105133056", "577586652210266112", "1155173304420532224", "2310346608841064448", "4620693217682128896", "9241386435364257792", "36028797018963968", "0", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "9223372036854775808", "0", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static D135_MOVES = ["0", "256", "66048", "16909312", "4328785920", "1108169199616", "283691315109888", "72624976668147712", "0", "65536", "16908288", "4328783872", "1108169195520", "283691315101696", "72624976668131328", "145249953336262656", "0", "16777216", "4328521728", "1108168671232", "283691314053120", "72624976666034176", "145249953332068352", "290499906664136704", "0", "4294967296", "1108101562368", "283691179835392", "72624976397598720", "145249952795197440", "290499905590394880", "580999811180789760", "0", "1099511627776", "283673999966208", "72624942037860352", "145249884075720704", "290499768151441408", "580999536302882816", "1161999072605765632", "0", "281474976710656", "72620543991349248", "145241087982698496", "290482175965396992", "580964351930793984", "1161928703861587968", "2323857407723175936", "0", "72057594037927936", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static D225_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "4", "8", "16", "32", "64", "0", "256", "513", "1026", "2052", "4104", "8208", "16416", "0", "65536", "131328", "262657", "525314", "1050628", "2101256", "4202512", "0", "16777216", "33619968", "67240192", "134480385", "268960770", "537921540", "1075843080", "0", "4294967296", "8606711808", "17213489152", "34426978560", "68853957121", "137707914242", "275415828484", "0", "1099511627776", "2203318222848", "4406653222912", "8813306511360", "17626613022976", "35253226045953", "70506452091906", "0", "281474976710656", "564049465049088", "1128103225065472", "2256206466908160", "4512412933881856", "9024825867763968", "18049651735527937"].map((item) => Long.fromString(item));
    private static D315_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "2", "4", "8", "16", "32", "64", "128", "0", "516", "1032", "2064", "4128", "8256", "16512", "32768", "0", "132104", "264208", "528416", "1056832", "2113664", "4227072", "8388608", "0", "33818640", "67637280", "135274560", "270549120", "541097984", "1082130432", "2147483648", "0", "8657571872", "17315143744", "34630287488", "69260574720", "138521083904", "277025390592", "549755813888", "0", "2216338399296", "4432676798592", "8865353596928", "17730707128320", "35461397479424", "70918499991552", "140737488355328", "0", "567382630219904", "1134765260439552", "2269530520813568", "4539061024849920", "9078117754732544", "18155135997837312", "36028797018963968", "0"].map((item) => Long.fromString(item));

    private enemy: Long;
    private occupiedSquares: Long;
    private emptySquares: Long;
    private enemyEmptySquares: Long; 
    private whiteAttack: Long;
    private blackAttack: Long;
    private whiteCastling: number;
    private blackCastling: number;
    private lastPos: number;
    public coronation?: string;

    constructor() {
    }

    public initGame() {
        var temp: Long = Long.fromInt(0);
        Utils.forEach(8, 15, (index: number) => { temp = temp.add(Utils.longPos(index)) });
        this.W_PAWNS = temp;
        this.W_ROOKS = Utils.longPos(0).add(Utils.longPos(7));
        this.W_KNIGHTS = Utils.longPos(1).add(Utils.longPos(6));
        this.W_BISHOPS = Utils.longPos(2).add(Utils.longPos(5));
        this.W_QUEENS = Utils.longPos(3);
        this.W_KING = Utils.longPos(4);
        temp = Long.fromInt(0);
        Utils.forEach(48, 55, (index: number) => { temp = temp.add(Utils.longPos(index)) });
        this.B_PAWNS = temp;
        this.B_ROOKS = Utils.longPos(56).add(Utils.longPos(63));
        this.B_KNIGHTS = Utils.longPos(57).add(Utils.longPos(62));
        this.B_BISHOPS = Utils.longPos(58).add(Utils.longPos(61));
        this.B_QUEENS = Utils.longPos(59);
        this.B_KING = Utils.longPos(60);
        this.whiteCastling = 0;
        this.blackCastling = 0;

        this.setIsWhiteMove(true);
    }

    public loadGame(board: IBoardProps) {
        this.W_PAWNS = board.W_PAWNS;
        this.W_ROOKS = board.W_ROOKS;
        this.W_KNIGHTS = board.W_KNIGHTS;
        this.W_BISHOPS = board.W_BISHOPS;
        this.W_QUEENS = board.W_QUEENS;
        this.W_KING = board.W_KING;

        this.B_PAWNS = board.B_PAWNS;
        this.B_ROOKS = board.B_ROOKS;
        this.B_KNIGHTS = board.B_KNIGHTS;
        this.B_BISHOPS = board.B_BISHOPS;
        this.B_QUEENS = board.B_QUEENS;
        this.B_KING = board.B_KING;

        this.whiteCastling = +board.W_CASTLING;
        this.blackCastling = +board.B_CASTLING;

        this.setIsWhiteMove(board.W_MOVE);
    }

    public static isWhite(piece: string): boolean | null {
        if (piece === BitGameState.W_PAWNS_CHAR ||
            piece === BitGameState.W_ROOKS_CHAR ||
            piece === BitGameState.W_KNIGHTS_CHAR ||
            piece === BitGameState.W_BISHOPS_CHAR ||
            piece === BitGameState.W_QUEENS_CHAR ||
            piece === BitGameState.W_KING_CHAR)
            return true;
        if (piece === BitGameState.B_PAWNS_CHAR ||
            piece === BitGameState.B_ROOKS_CHAR ||
            piece === BitGameState.B_KNIGHTS_CHAR ||
            piece === BitGameState.B_BISHOPS_CHAR ||
            piece === BitGameState.B_QUEENS_CHAR ||
            piece === BitGameState.B_KING_CHAR)
            return false;
        return null;
    }
    
    public getPiece(position: number): string | null {
        var pos = Utils.longPos(position);
        if (this.W_PAWNS.and(pos).notEquals(0)) {
            return BitGameState.W_PAWNS_CHAR;
        }
        if (this.W_ROOKS.and(pos).notEquals(0)) {
            return BitGameState.W_ROOKS_CHAR;
        }
        if (this.W_KNIGHTS.and(pos).notEquals(0)) {
            return BitGameState.W_KNIGHTS_CHAR;
        }
        if (this.W_BISHOPS.and(pos).notEquals(0)) {
            return BitGameState.W_BISHOPS_CHAR;
        }
        if (this.W_QUEENS.and(pos).notEquals(0)) {
            return BitGameState.W_QUEENS_CHAR;
        }
        if (this.W_KING.and(pos).notEquals(0)) {
            return BitGameState.W_KING_CHAR;
        }
        if (this.B_PAWNS.and(pos).notEquals(0)) {
            return BitGameState.B_PAWNS_CHAR;
        }
        if (this.B_ROOKS.and(pos).notEquals(0)) {
            return BitGameState.B_ROOKS_CHAR;
        }
        if (this.B_KNIGHTS.and(pos).notEquals(0)) {
            return BitGameState.B_KNIGHTS_CHAR;
        }
        if (this.B_BISHOPS.and(pos).notEquals(0)) {
            return BitGameState.B_BISHOPS_CHAR;
        }
        if (this.B_QUEENS.and(pos).notEquals(0)) {
            return BitGameState.B_QUEENS_CHAR;
        }
        if (this.B_KING.and(pos).notEquals(0)) {
            return BitGameState.B_KING_CHAR;
        }
        return null; 
    }

    public static getPiece(board: IBoardProps, position: number): string | undefined {
        var pos = Utils.longPos(position);
        if (board.W_PAWNS.and(pos).notEquals(0)) {
            return BitGameState.W_PAWNS_CHAR;
        }
        if (board.W_ROOKS.and(pos).notEquals(0)) {
            return BitGameState.W_ROOKS_CHAR;
        }
        if (board.W_KNIGHTS.and(pos).notEquals(0)) {
            return BitGameState.W_KNIGHTS_CHAR;
        }
        if (board.W_BISHOPS.and(pos).notEquals(0)) {
            return BitGameState.W_BISHOPS_CHAR;
        }
        if (board.W_QUEENS.and(pos).notEquals(0)) {
            return BitGameState.W_QUEENS_CHAR;
        }
        if (board.W_KING.and(pos).notEquals(0)) {
            return BitGameState.W_KING_CHAR;
        }
        if (board.B_PAWNS.and(pos).notEquals(0)) {
            return BitGameState.B_PAWNS_CHAR;
        }
        if (board.B_ROOKS.and(pos).notEquals(0)) {
            return BitGameState.B_ROOKS_CHAR;
        }
        if (board.B_KNIGHTS.and(pos).notEquals(0)) {
            return BitGameState.B_KNIGHTS_CHAR;
        }
        if (board.B_BISHOPS.and(pos).notEquals(0)) {
            return BitGameState.B_BISHOPS_CHAR;
        }
        if (board.B_QUEENS.and(pos).notEquals(0)) {
            return BitGameState.B_QUEENS_CHAR;
        }
        if (board.B_KING.and(pos).notEquals(0)) {
            return BitGameState.B_KING_CHAR;
        }
        return undefined; 
    }

    /*private setPiece(piece: string, position: number) {
        this.clear(position);

        if (piece === BitGameState.W_BISHOPS_CHAR) {
            this.W_BISHOPS = this.W_BISHOPS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.W_KING_CHAR) {
            this.W_KING = this.W_KING.or(Utils.longPos(position));
        }
        if (piece === BitGameState.W_KNIGHTS_CHAR) {
            this.W_KNIGHTS = this.W_KNIGHTS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.W_PAWNS_CHAR) {
            this.W_PAWNS = this.W_PAWNS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.W_QUEENS_CHAR) {
            this.W_QUEENS = this.W_QUEENS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.W_ROOKS_CHAR) {
            this.W_ROOKS = this.W_ROOKS.or(Utils.longPos(position));
        }

        if (piece === BitGameState.B_BISHOPS_CHAR) {
            this.B_BISHOPS = this.B_BISHOPS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.B_KING_CHAR) {
            this.B_KING = this.B_KING.or(Utils.longPos(position));
        }
        if (piece === BitGameState.B_KNIGHTS_CHAR) {
            this.B_KNIGHTS = this.B_KNIGHTS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.B_PAWNS_CHAR) {
            this.B_PAWNS = this.B_PAWNS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.B_QUEENS_CHAR) {
            this.B_QUEENS = this.B_QUEENS.or(Utils.longPos(position));
        }
        if (piece === BitGameState.B_ROOKS_CHAR) {
            this.B_ROOKS = this.B_ROOKS.or(Utils.longPos(position));
        }
    }*/

    private clearBoard(board: Long) {        
        if (this.W_PAWNS.and(board).notEquals(0)) {
            this.W_PAWNS = this.W_PAWNS.subtract(board);
        }
        if (this.W_ROOKS.and(board).notEquals(0)) {
            this.W_ROOKS = this.W_ROOKS.subtract(board);
        }
        if (this.W_KNIGHTS.and(board).notEquals(0)) {
            this.W_KNIGHTS = this.W_KNIGHTS.subtract(board);
        }
        if (this.W_BISHOPS.and(board).notEquals(0)) {
            this.W_BISHOPS = this.W_BISHOPS.subtract(board);
        }
        if (this.W_QUEENS.and(board).notEquals(0)) {
            this.W_QUEENS = this.W_QUEENS.subtract(board);
        }
        if (this.W_KING.and(board).notEquals(0)) {
            this.W_KING = this.W_KING.subtract(board);
        }
        if (this.B_PAWNS.and(board).notEquals(0)) {
            this.B_PAWNS = this.B_PAWNS.subtract(board);
        }
        if (this.B_ROOKS.and(board).notEquals(0)) {
            this.B_ROOKS = this.B_ROOKS.subtract(board);
        }
        if (this.B_KNIGHTS.and(board).notEquals(0)) {
            this.B_KNIGHTS = this.B_KNIGHTS.subtract(board);
        }
        if (this.B_BISHOPS.and(board).notEquals(0)) {
            this.B_BISHOPS = this.B_BISHOPS.subtract(board);
        }
        if (this.B_QUEENS.and(board).notEquals(0)) {
            this.B_QUEENS = this.B_QUEENS.subtract(board);
        }
        if (this.B_KING.and(board).notEquals(0)) {
            this.B_KING = this.B_KING.subtract(board);
        }
    }

    private clear(position: number) {
        var board = Utils.longPos(position);
        this.clearBoard(board);
    }

    private getPositions(board: Long): number[] {
        var result = [];
        for (var i = 0; i < 64; i++) {
            if (Utils.longPos(i).and(board).notEquals(0)) {
                result.push(i);
            }
        }
        return result;
    }

    public updateState(isWhiteMove: boolean) {
        this.occupiedSquares = this.B_PAWNS.or(this.B_ROOKS).or(this.B_KNIGHTS).or(this.B_BISHOPS).or(this.B_QUEENS).or(this.B_KING).or(this.W_PAWNS).or(this.W_ROOKS).or(this.W_KNIGHTS).or(this.W_BISHOPS).or(this.W_QUEENS).or(this.W_KING);
        this.emptySquares = this.occupiedSquares.xor(BitGameState.FULLBOARD);

        this.enemy = this.B_PAWNS.or(this.B_ROOKS).or(this.B_KNIGHTS).or(this.B_BISHOPS).or(this.B_QUEENS).or(this.B_KING);
        this.enemyEmptySquares = this.enemy.or(this.emptySquares);
        this.whiteAttack = this.getAttackBoard(true);

        this.enemy = this.W_PAWNS.or(this.W_ROOKS).or(this.W_KNIGHTS).or(this.W_BISHOPS).or(this.W_QUEENS).or(this.W_KING);
        this.enemyEmptySquares = this.enemy.or(this.emptySquares);
        this.blackAttack = this.getAttackBoard(false);

        this.enemy = isWhiteMove ? this.B_PAWNS.or(this.B_ROOKS).or(this.B_KNIGHTS).or(this.B_BISHOPS).or(this.B_QUEENS).or(this.B_KING) : this.W_PAWNS.or(this.W_ROOKS).or(this.W_KNIGHTS).or(this.W_BISHOPS).or(this.W_QUEENS).or(this.W_KING);        
        this.enemyEmptySquares = this.enemy.or(this.emptySquares);
    }

    private getFutureMoveKing(kingMoves: Long): Long {
        return kingMoves.and(this.enemyEmptySquares);
    }

    private getFutureMoveKnight(knightMoves: Long): Long {
        return knightMoves.and(this.enemyEmptySquares);
    }

    private getFutureMovePawn(forwardMoves: Long, twoForwardMoves: Long, attack: Long): Long {
        var result = forwardMoves.and(this.emptySquares);
        if (result.notEquals(0)) {
            result = result.or(twoForwardMoves.and(this.emptySquares));
        }
        result = result.or(attack.and(this.enemy));
        result = result.or(attack.and(this.PAWN_PASSANT));
        return result;
    }

    private getFutureMoveRook(right: Long, left: Long, up: Long, down: Long): Long {
        var right_moves = right.and(this.occupiedSquares);
        right_moves = right_moves.shl(1).or(right_moves.shl(2)).or(right_moves.shl(3)).or(right_moves.shl(4)).or(right_moves.shl(5)).or(right_moves.shl(6));
        right_moves = right_moves.and(right);
        right_moves = right_moves.xor(right).and(this.enemyEmptySquares);

        var left_moves = left.and(this.occupiedSquares);
        left_moves = left_moves.shr(1).or(left_moves.shr(2)).or(left_moves.shr(3)).or(left_moves.shr(4)).or(left_moves.shr(5)).or(left_moves.shr(6));
        left_moves = left_moves.and(left);
        left_moves = left_moves.xor(left).and(this.enemyEmptySquares);

        var up_moves = up.and(this.occupiedSquares);
        up_moves = up_moves.shl(8).or(up_moves.shl(16)).or(up_moves.shl(24)).or(up_moves.shl(32)).or(up_moves.shl(40)).or(up_moves.shl(48));
        up_moves = up_moves.and(up);
        up_moves = up_moves.xor(up).and(this.enemyEmptySquares);

        var down_moves = down.and(this.occupiedSquares);
        down_moves = down_moves.shr(8).or(down_moves.shr(16)).or(down_moves.shr(24)).or(down_moves.shr(32)).or(down_moves.shr(40)).or(down_moves.shr(48));
        down_moves = down_moves.and(down);
        down_moves = down_moves.xor(down).and(this.enemyEmptySquares);

        return right_moves.or(left_moves).or(up_moves).or(down_moves);
    }

    private getFutureMoveBishop(d45: Long, d135: Long, d225: Long, d315: Long): Long {
        var d45_moves = d45.and(this.occupiedSquares);
        d45_moves = d45_moves.shl(9).or(d45_moves.shl(18)).or(d45_moves.shl(27)).or(d45_moves.shl(36)).or(d45_moves.shl(45)).or(d45_moves.shl(54));
        d45_moves = d45_moves.and(d45);
        d45_moves = d45_moves.xor(d45).and(this.enemyEmptySquares);

        var d135_moves = d135.and(this.occupiedSquares);
        d135_moves = d135_moves.shl(7).or(d135_moves.shl(14)).or(d135_moves.shl(21)).or(d135_moves.shl(28)).or(d135_moves.shl(35)).or(d135_moves.shl(42));
        d135_moves = d135_moves.and(d135);
        d135_moves = d135_moves.xor(d135).and(this.enemyEmptySquares);

        var d225_moves = d225.and(this.occupiedSquares);
        d225_moves = d225_moves.shr(9).or(d225_moves.shr(18)).or(d225_moves.shr(27)).or(d225_moves.shr(36)).or(d225_moves.shr(45)).or(d225_moves.shr(54));
        d225_moves = d225_moves.and(d225);
        d225_moves = d225_moves.xor(d225).and(this.enemyEmptySquares);

        var d315_moves = d315.and(this.occupiedSquares);
        d315_moves = d315_moves.shr(7).or(d315_moves.shr(14)).or(d315_moves.shr(21)).or(d315_moves.shr(28)).or(d315_moves.shr(35)).or(d315_moves.shr(42));
        d315_moves = d315_moves.and(d315);
        d315_moves = d315_moves.xor(d315).and(this.enemyEmptySquares);

        return d45_moves.or(d135_moves).or(d225_moves).or(d315_moves);
    }

    private getBoardFutureMove(position: number, includePawnMovement: boolean): Long {
        var piece = this.getPiece(position);

        if (piece === BitGameState.W_KING_CHAR || piece === BitGameState.B_KING_CHAR) {
            var result = this.getFutureMoveKing(BitGameState.KING_MOVES[position]);
            if (position === 4) {
                if (this.blackAttack.and(240).equals(0) && this.occupiedSquares.and(96).equals(0) && (this.whiteCastling & 6) === 0) {
                    result = result.or(64);
                }
                if (this.blackAttack.and(31).equals(0) && this.occupiedSquares.and(14).equals(0) && (this.whiteCastling & 3) === 0) {
                    result = result.or(4);
                }
            }
            if (position === 60) {
                if (this.whiteAttack.and(Long.fromString("17293822569102704640")).equals(0) && this.occupiedSquares.and(Long.fromString("6917529027641081856")).equals(0) && (this.blackCastling & 6) === 0) {
                    result = result.or(Utils.longPos(62));
                }
                if (this.whiteAttack.and(Long.fromString("2233785415175766016")).equals(0) && this.occupiedSquares.and(Long.fromString("1008806316530991104")).equals(0) && (this.blackCastling & 3) === 0) {
                    result = result.or(Utils.longPos(58));
                }
            }
            return result;
        }
        if (piece === BitGameState.W_KNIGHTS_CHAR || piece === BitGameState.B_KNIGHTS_CHAR) {
            return this.getFutureMoveKnight(BitGameState.KNIGHT_MOVES[position]);
        }
        if (piece === BitGameState.W_ROOKS_CHAR || piece === BitGameState.B_ROOKS_CHAR) {
            return this.getFutureMoveRook(BitGameState.RIGHT_MOVES[position], BitGameState.LEFT_MOVES[position], BitGameState.UP_MOVES[position], BitGameState.DOWN_MOVES[position]);
        }
        if (piece === BitGameState.W_BISHOPS_CHAR || piece === BitGameState.B_BISHOPS_CHAR) {
            return this.getFutureMoveBishop(BitGameState.D45_MOVES[position], BitGameState.D135_MOVES[position], BitGameState.D225_MOVES[position], BitGameState.D315_MOVES[position]);
        }
        if (piece === BitGameState.W_QUEENS_CHAR || piece === BitGameState.B_QUEENS_CHAR) {
            var rookMoves = this.getFutureMoveRook(BitGameState.RIGHT_MOVES[position], BitGameState.LEFT_MOVES[position], BitGameState.UP_MOVES[position], BitGameState.DOWN_MOVES[position]);
            var bishopMoves = this.getFutureMoveBishop(BitGameState.D45_MOVES[position], BitGameState.D135_MOVES[position], BitGameState.D225_MOVES[position], BitGameState.D315_MOVES[position]);
            return rookMoves.or(bishopMoves);
        }

        if (piece === BitGameState.W_PAWNS_CHAR) {
            return this.getFutureMovePawn(includePawnMovement ? BitGameState.W_PAWN_FORWARD_MOVES[position] : Long.fromInt(0), includePawnMovement ? BitGameState.W_PAWN_TWO_FORWARD_MOVES[position] : Long.fromInt(0), BitGameState.W_PAWN_ATTACK[position]);
        }
        if (piece === BitGameState.B_PAWNS_CHAR) {
            return this.getFutureMovePawn(includePawnMovement ? BitGameState.B_PAWN_FORWARD_MOVES[position] : Long.fromInt(0), includePawnMovement ? BitGameState.B_PAWN_TWO_FORWARD_MOVES[position] : Long.fromInt(0), BitGameState.B_PAWN_ATTACK[position]);
        }

        return Long.fromInt(0);
    }

    private getBoardFutureAttack(position: number, includePawnMovement: boolean): Long {
        var piece = this.getPiece(position);

        if (piece === BitGameState.W_KING_CHAR || piece === BitGameState.B_KING_CHAR) {
            return this.getFutureMoveKing(BitGameState.KING_MOVES[position]);
        }
        if (piece === BitGameState.W_KNIGHTS_CHAR || piece === BitGameState.B_KNIGHTS_CHAR) {
            return this.getFutureMoveKnight(BitGameState.KNIGHT_MOVES[position]);
        }
        if (piece === BitGameState.W_ROOKS_CHAR || piece === BitGameState.B_ROOKS_CHAR) {
            return this.getFutureMoveRook(BitGameState.RIGHT_MOVES[position], BitGameState.LEFT_MOVES[position], BitGameState.UP_MOVES[position], BitGameState.DOWN_MOVES[position]);
        }
        if (piece === BitGameState.W_BISHOPS_CHAR || piece === BitGameState.B_BISHOPS_CHAR) {
            return this.getFutureMoveBishop(BitGameState.D45_MOVES[position], BitGameState.D135_MOVES[position], BitGameState.D225_MOVES[position], BitGameState.D315_MOVES[position]);
        }
        if (piece === BitGameState.W_QUEENS_CHAR || piece === BitGameState.B_QUEENS_CHAR) {
            var rookMoves = this.getFutureMoveRook(BitGameState.RIGHT_MOVES[position], BitGameState.LEFT_MOVES[position], BitGameState.UP_MOVES[position], BitGameState.DOWN_MOVES[position]);
            var bishopMoves = this.getFutureMoveBishop(BitGameState.D45_MOVES[position], BitGameState.D135_MOVES[position], BitGameState.D225_MOVES[position], BitGameState.D315_MOVES[position]);
            return rookMoves.or(bishopMoves);
        }

        if (piece === BitGameState.W_PAWNS_CHAR) {
            return BitGameState.W_PAWN_ATTACK[position];
        }
        if (piece === BitGameState.B_PAWNS_CHAR) {
            return BitGameState.B_PAWN_ATTACK[position];
        }

        return Long.fromInt(0);
    }

    public getFutureMove(position: number): number[] {
        var positions = this.getPositions(this.getBoardFutureMove(position, true));
        return positions.filter((endPosition) => !this.simulateAndVerifyCheck(position, endPosition));
    }

    public isThereMove(isWhite?: boolean): boolean {
        var wh = isWhite === true || (isWhite == null && this._isWhiteMove === true);
        for (var pos = 0; pos < 64; pos++) {
            var piece = this.getPiece(pos);
            if (piece != null && BitGameState.isWhite(piece) === wh) {
                var positions = this.getPositions(this.getBoardFutureMove(pos, true));
                if (positions.filter((endPosition) => !this.simulateAndVerifyCheck(pos, endPosition)).length > 0) {
                    return true;
                }
            }            
        }
        return false;
    }

    private getAttackBoard(isWhiteAttack: boolean): Long {
        var result = Long.fromInt(0);
        for (var pos = 0; pos < 64; pos++) {
            var piece = this.getPiece(pos);
            if (piece != null && BitGameState.isWhite(piece) === isWhiteAttack) {
                var posAttack = this.getBoardFutureAttack(pos, false);
                result = result.or(posAttack);
            }
        }
        return result;
    }

    public isCheck(isWhite?: boolean): boolean {
        if (isWhite === true || (isWhite == null && this._isWhiteMove === true)) {
            return this.W_KING.and(this.blackAttack).notEquals(0);
        }
        return this.B_KING.and(this.whiteAttack).notEquals(0);
    }

    public isCheckMate(isWhite?: boolean): boolean {
        return this.isCheck(isWhite) && !this.isThereMove(isWhite);
    }

    public isTable(isWhite?: boolean): boolean {
        return !this.isCheck(isWhite) && !this.isThereMove(isWhite);
    }

    public move(initPos: number, endPos: number): void {
        var initP = Utils.longPos(initPos);
        var endP = Utils.longPos(endPos);
        var tempPawnPassant = Long.fromValue(this.PAWN_PASSANT);
        this.PAWN_PASSANT = Long.fromInt(0);
        this.clear(endPos);
        if (this.W_PAWNS.and(initP).notEquals(0)) {
            this.W_PAWNS = this.W_PAWNS.subtract(initP).add(endP);
            if (tempPawnPassant.and(endP).eq(endP)) { this.clearBoard(tempPawnPassant.subtract(endP)); }
            if (Math.abs(endPos - initPos) === 16) { this.PAWN_PASSANT = Utils.longPos(initPos + 8).add(Utils.longPos(initPos + 16)); }
            if (endPos >= 56) { this.coronation = "w"; this.lastPos = endPos; }
            this.toggle();
        }
        if (this.W_ROOKS.and(initP).notEquals(0)) {
            this.W_ROOKS = this.W_ROOKS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.W_KNIGHTS.and(initP).notEquals(0)) {
            this.W_KNIGHTS = this.W_KNIGHTS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.W_BISHOPS.and(initP).notEquals(0)) {
            this.W_BISHOPS = this.W_BISHOPS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.W_QUEENS.and(initP).notEquals(0)) {
            this.W_QUEENS = this.W_QUEENS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.W_KING.and(initP).notEquals(0)) {
            this.W_KING = this.W_KING.subtract(initP).add(endP);
            if (endPos - initPos === 2) {
                this.W_ROOKS = this.W_ROOKS.subtract(128).add(32);
            }
            if (initPos - endPos === 2) {
                this.W_ROOKS = this.W_ROOKS.subtract(1).add(8);
            }
            this.toggle();
        }
        if (this.B_PAWNS.and(initP).notEquals(0)) {
            this.B_PAWNS = this.B_PAWNS.subtract(initP).add(endP);
            if (tempPawnPassant.and(endP).eq(endP)) { this.clearBoard(tempPawnPassant.subtract(endP)); }
            if (Math.abs(endPos - initPos) === 16) { this.PAWN_PASSANT = Utils.longPos(initPos - 8).add(Utils.longPos(initPos - 16)); }
            if (endPos <= 7) { this.coronation = "b"; this.lastPos = endPos; }
            this.toggle();
        }
        if (this.B_ROOKS.and(initP).notEquals(0)) {
            this.B_ROOKS = this.B_ROOKS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.B_KNIGHTS.and(initP).notEquals(0)) {
            this.B_KNIGHTS = this.B_KNIGHTS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.B_BISHOPS.and(initP).notEquals(0)) {
            this.B_BISHOPS = this.B_BISHOPS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.B_QUEENS.and(initP).notEquals(0)) {
            this.B_QUEENS = this.B_QUEENS.subtract(initP).add(endP);
            this.toggle();
        }
        if (this.B_KING.and(initP).notEquals(0)) {
            this.B_KING = this.B_KING.subtract(initP).add(endP);
            if (endPos - initPos === 2) {
                this.B_ROOKS = this.B_ROOKS.subtract(Utils.longPos(63)).add(Utils.longPos(61));
            }
            if (initPos - endPos === 2) {
                this.B_ROOKS = this.B_ROOKS.subtract(Utils.longPos(56)).add(Utils.longPos(59));
            }
            this.toggle();
        }

        if (initPos === 0 || endPos === 0) {
            this.whiteCastling = this.whiteCastling | 1;
        }
        if (initPos === 4) {
            this.whiteCastling = this.whiteCastling | 2;
        }
        if (initPos === 7 || endPos === 7) {
            this.whiteCastling = this.whiteCastling | 4;
        }
        if (initPos === 56 || endPos === 56) {
            this.blackCastling = this.blackCastling | 1;
        }
        if (initPos === 60) {
            this.blackCastling = this.blackCastling | 2;
        }
        if (initPos === 63 || endPos === 63) {
            this.blackCastling = this.blackCastling | 4;
        }
    }

    public coronate(piece: string) {
        this.clear(this.lastPos);
        if (piece === "w-rook") {
            this.W_ROOKS = this.W_ROOKS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "w-knight") {
            this.W_KNIGHTS = this.W_KNIGHTS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "w-bishop") {
            this.W_BISHOPS = this.W_BISHOPS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "w-queen") {
            this.W_QUEENS = this.W_QUEENS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "b-rook") {
            this.B_ROOKS = this.B_ROOKS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "b-knight") {
            this.B_KNIGHTS = this.B_KNIGHTS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "b-bishop") {
            this.B_BISHOPS = this.B_BISHOPS.or(Utils.longPos(this.lastPos));
        }
        if (piece === "b-queen") {
            this.B_QUEENS = this.B_QUEENS.or(Utils.longPos(this.lastPos));
        }
        this.coronation = undefined;
        this.updateState(this._isWhiteMove);
    }

    public simulateAndVerifyCheck(initPos: number, endPos: number): boolean {
        var obj = this.clone();
        obj.move(initPos, endPos);
        return obj.isCheck(this._isWhiteMove);
    }

    private clone(): any {
        return {
            _isWhiteMove: this._isWhiteMove,
            W_ROOKS: Long.fromValue(this.W_ROOKS),
            W_KNIGHTS: Long.fromValue(this.W_KNIGHTS),
            W_BISHOPS: Long.fromValue(this.W_BISHOPS),
            W_QUEENS: Long.fromValue(this.W_QUEENS),
            W_KING: Long.fromValue(this.W_KING),
            W_PAWNS: Long.fromValue(this.W_PAWNS),
            B_ROOKS: Long.fromValue(this.B_ROOKS),
            B_KNIGHTS: Long.fromValue(this.B_KNIGHTS),
            B_BISHOPS: Long.fromValue(this.B_BISHOPS),
            B_QUEENS: Long.fromValue(this.B_QUEENS),
            B_KING: Long.fromValue(this.B_KING),
            B_PAWNS: Long.fromValue(this.B_PAWNS),

            PAWN_PASSANT: Long.fromValue(this.PAWN_PASSANT),
            enemy: this.enemy,
            occupiedSquares: this.occupiedSquares,
            emptySquares: this.emptySquares,
            enemyEmptySquares: this.enemyEmptySquares,
            whiteAttack: this.whiteAttack,
            blackAttack: this.blackAttack,

            move: this.move,
            clear: this.clear,
            toggle: this.toggle,
            clearBoard: this.clearBoard,
            updateState: this.updateState,
            getAttackBoard: this.getAttackBoard,
            getPiece: this.getPiece,
            getBoardFutureMove: this.getBoardFutureMove,
            getBoardFutureAttack: this.getBoardFutureAttack,
            getFutureMoveRook: this.getFutureMoveRook,
            getFutureMoveKnight: this.getFutureMoveKnight,
            getFutureMovePawn: this.getFutureMovePawn, 
            getFutureMoveBishop: this.getFutureMoveBishop,
            getFutureMoveKing: this.getFutureMoveKing, 
            isCheck: this.isCheck 
        };
    }
}

export class Game {
    public static instance(): IGameState {
        if (!window["game"]) {
            window["game"] = new BitGameState();
        }
        
        return window["game"];
    }
}

/*import { IBoardProps } from '../components/Board/Board';
import { GameChar } from './GameChar';
import { Utils } from './GameUtils';
import * as Long from 'long';

export class Game {
    
    public static W_ROOKS_CHAR = 'r';
    public static W_KNIGHTS_CHAR = 'n';
    public static W_BISHOPS_CHAR = 'b';
    public static W_QUEENS_CHAR = 'q';
    public static W_KING_CHAR = 'k';
    public static W_PAWNS_CHAR = 'p';
    public static B_ROOKS_CHAR = 'R';
    public static B_KNIGHTS_CHAR = 'N';
    public static B_BISHOPS_CHAR = 'B';
    public static B_QUEENS_CHAR = 'Q';
    public static B_KING_CHAR = 'K';
    public static B_PAWNS_CHAR = 'P';

    private static KING_MOVES = ["770", "1797", "3594", "7188", "14376", "28752", "57504", "49216", "197123", "460039", "920078", "1840156", "3680312", "7360624", "14721248", "12599488", "50463488", "117769984", "235539968", "471079936", "942159872", "1884319744", "3768639488", "3225468928", "12918652928", "30149115904", "60298231808", "120596463616", "241192927232", "482385854464", "964771708928", "825720045568", "3307175149568", "7718173671424", "15436347342848", "30872694685696", "61745389371392", "123490778742784", "246981557485568", "211384331665408", "846636838289408", "1975852459884544", "3951704919769088", "7903409839538176", "15806819679076352", "31613639358152704", "63227278716305408", "54114388906344448", "216739030602088448", "505818229730443264", "1011636459460886528", "2023272918921773056", "4046545837843546112", "8093091675687092224", "16186183351374184448", "13853283560024178688", "144959613005987840", "362258295026614272", "724516590053228544", "1449033180106457088", "2898066360212914176", "5796132720425828352", "11592265440851656704", "4665729213955833856"].map((item) => Long.fromString(item));
    private static KNIGHT_MOVES = ["132096", "329728", "659712", "1319424", "2638848", "5277696", "10489856", "4202496", "33816580", "84410376", "168886289", "337772578", "675545156", "1351090312", "2685403152", "1075839008", "8657044482", "21609056261", "43234889994", "86469779988", "172939559976", "345879119952", "687463207072", "275414786112", "2216203387392", "5531918402816", "11068131838464", "22136263676928", "44272527353856", "88545054707712", "175990581010432", "70506185244672", "567348067172352", "1416171111120896", "2833441750646784", "5666883501293568", "11333767002587136", "22667534005174272", "45053588738670592", "18049583422636032", "145241105196122112", "362539804446949376", "725361088165576704", "1450722176331153408", "2901444352662306816", "5802888705324613632", "11533718717099671552", "4620693356194824192", "288234782788157440", "576469569871282176", "1224997833292120064", "2449995666584240128", "4899991333168480256", "9799982666336960512", "1152939783987658752", "2305878468463689728", "1128098930098176", "2257297371824128", "4796069720358912", "9592139440717824", "19184278881435648", "38368557762871296", "4679521487814656", "9077567998918656"].map((item) => Long.fromString(item));
    private static W_PAWN_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "65536", "131072", "262144", "524288", "1048576", "2097152", "4194304", "8388608", "16777216", "33554432", "67108864", "134217728", "268435456", "536870912", "1073741824", "2147483648", "4294967296", "8589934592", "17179869184", "34359738368", "68719476736", "137438953472", "274877906944", "549755813888", "1099511627776", "2199023255552", "4398046511104", "8796093022208", "17592186044416", "35184372088832", "70368744177664", "140737488355328", "281474976710656", "562949953421312", "1125899906842624", "2251799813685248", "4503599627370496", "9007199254740992", "18014398509481984", "36028797018963968", "72057594037927936", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "9223372036854775808", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static B_PAWN_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024", "2048", "4096", "8192", "16384", "32768", "65536", "131072", "262144", "524288", "1048576", "2097152", "4194304", "8388608", "16777216", "33554432", "67108864", "134217728", "268435456", "536870912", "1073741824", "2147483648", "4294967296", "8589934592", "17179869184", "34359738368", "68719476736", "137438953472", "274877906944", "549755813888", "1099511627776", "2199023255552", "4398046511104", "8796093022208", "17592186044416", "35184372088832", "70368744177664", "140737488355328", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static W_PAWN_TWO_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "16777216", "33554432", "67108864", "134217728", "268435456", "536870912", "1073741824", "2147483648", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static B_PAWN_TWO_FORWARD_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "4294967296", "8589934592", "17179869184", "34359738368", "68719476736", "137438953472", "274877906944", "549755813888", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static W_PAWN_ATTACK = ["0", "0", "0", "0", "0", "0", "0", "0", "131072", "327680", "655360", "1310720", "2621440", "5242880", "10485760", "4194304", "33554432", "83886080", "167772160", "335544320", "671088640", "1342177280", "2684354560", "1073741824", "8589934592", "21474836480", "42949672960", "85899345920", "171798691840", "343597383680", "687194767360", "274877906944", "2199023255552", "5497558138880", "10995116277760", "21990232555520", "43980465111040", "87960930222080", "175921860444160", "70368744177664", "562949953421312", "1407374883553280", "2814749767106560", "5629499534213120", "11258999068426240", "22517998136852480", "45035996273704960", "18014398509481984", "144115188075855872", "360287970189639680", "720575940379279360", "1441151880758558720", "2882303761517117440", "5764607523034234880", "11529215046068469760", "4611686018427387904", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static B_PAWN_ATTACK = ["0", "0", "0", "0", "0", "0", "0", "0", "2", "5", "10", "20", "40", "80", "160", "64", "512", "1280", "2560", "5120", "10240", "20480", "40960", "16384", "131072", "327680", "655360", "1310720", "2621440", "5242880", "10485760", "4194304", "33554432", "83886080", "167772160", "335544320", "671088640", "1342177280", "2684354560", "1073741824", "8589934592", "21474836480", "42949672960", "85899345920", "171798691840", "343597383680", "687194767360", "274877906944", "2199023255552", "5497558138880", "10995116277760", "21990232555520", "43980465111040", "87960930222080", "175921860444160", "70368744177664", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static FULLBOARD = Long.fromString("18446744073709551615");

    private static RIGHT_MOVES = ["254", "252", "248", "240", "224", "192", "128", "0", "65024", "64512", "63488", "61440", "57344", "49152", "32768", "0", "16646144", "16515072", "16252928", "15728640", "14680064", "12582912", "8388608", "0", "4261412864", "4227858432", "4160749568", "4026531840", "3758096384", "3221225472", "2147483648", "0", "1090921693184", "1082331758592", "1065151889408", "1030792151040", "962072674304", "824633720832", "549755813888", "0", "279275953455104", "277076930199552", "272678883688448", "263882790666240", "246290604621824", "211106232532992", "140737488355328", "0", "71494644084506624", "70931694131085312", "69805794224242688", "67553994410557440", "63050394783186944", "54043195528445952", "36028797018963968", "0", "18302628885633695744", "18158513697557839872", "17870283321406128128", "17293822569102704640", "16140901064495857664", "13835058055282163712", "9223372036854775808", "0"].map((item) => Long.fromString(item));
    private static LEFT_MOVES = ["0", "1", "3", "7", "15", "31", "63", "127", "0", "256", "768", "1792", "3840", "7936", "16128", "32512", "0", "65536", "196608", "458752", "983040", "2031616", "4128768", "8323072", "0", "16777216", "50331648", "117440512", "251658240", "520093696", "1056964608", "2130706432", "0", "4294967296", "12884901888", "30064771072", "64424509440", "133143986176", "270582939648", "545460846592", "0", "1099511627776", "3298534883328", "7696581394432", "16492674416640", "34084860461056", "69269232549888", "139637976727552", "0", "281474976710656", "844424930131968", "1970324836974592", "4222124650659840", "8725724278030336", "17732923532771328", "35747322042253312", "0", "72057594037927936", "216172782113783808", "504403158265495552", "1080863910568919040", "2233785415175766016", "4539628424389459968", "9151314442816847872"].map((item) => Long.fromString(item));
    private static UP_MOVES = ["72340172838076672", "144680345676153344", "289360691352306688", "578721382704613376", "1157442765409226752", "2314885530818453504", "4629771061636907008", "9259542123273814016", "72340172838076416", "144680345676152832", "289360691352305664", "578721382704611328", "1157442765409222656", "2314885530818445312", "4629771061636890624", "9259542123273781248", "72340172838010880", "144680345676021760", "289360691352043520", "578721382704087040", "1157442765408174080", "2314885530816348160", "4629771061632696320", "9259542123265392640", "72340172821233664", "144680345642467328", "289360691284934656", "578721382569869312", "1157442765139738624", "2314885530279477248", "4629771060558954496", "9259542121117908992", "72340168526266368", "144680337052532736", "289360674105065472", "578721348210130944", "1157442696420261888", "2314885392840523776", "4629770785681047552", "9259541571362095104", "72339069014638592", "144678138029277184", "289356276058554368", "578712552117108736", "1157425104234217472", "2314850208468434944", "4629700416936869888", "9259400833873739776", "72057594037927936", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "9223372036854775808", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static DOWN_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "4", "8", "16", "32", "64", "128", "257", "514", "1028", "2056", "4112", "8224", "16448", "32896", "65793", "131586", "263172", "526344", "1052688", "2105376", "4210752", "8421504", "16843009", "33686018", "67372036", "134744072", "269488144", "538976288", "1077952576", "2155905152", "4311810305", "8623620610", "17247241220", "34494482440", "68988964880", "137977929760", "275955859520", "551911719040", "1103823438081", "2207646876162", "4415293752324", "8830587504648", "17661175009296", "35322350018592", "70644700037184", "141289400074368", "282578800148737", "565157600297474", "1130315200594948", "2260630401189896", "4521260802379792", "9042521604759584", "18085043209519168", "36170086419038336"].map((item) => Long.fromString(item));

    private static D45_MOVES = ["9241421688590303744", "36099303471055872", "141012904183808", "550831656960", "2151686144", "8404992", "32768", "0", "4620710844295151616", "9241421688590303232", "36099303471054848", "141012904181760", "550831652864", "2151677952", "8388608", "0", "2310355422147510272", "4620710844295020544", "9241421688590041088", "36099303470530560", "141012903133184", "550829555712", "2147483648", "0", "1155177711056977920", "2310355422113955840", "4620710844227911680", "9241421688455823360", "36099303202095104", "141012366262272", "549755813888", "0", "577588851233521664", "1155177702467043328", "2310355404934086656", "4620710809868173312", "9241421619736346624", "36099165763141632", "140737488355328", "0", "288793326105133056", "577586652210266112", "1155173304420532224", "2310346608841064448", "4620693217682128896", "9241386435364257792", "36028797018963968", "0", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "9223372036854775808", "0", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static D135_MOVES = ["0", "256", "66048", "16909312", "4328785920", "1108169199616", "283691315109888", "72624976668147712", "0", "65536", "16908288", "4328783872", "1108169195520", "283691315101696", "72624976668131328", "145249953336262656", "0", "16777216", "4328521728", "1108168671232", "283691314053120", "72624976666034176", "145249953332068352", "290499906664136704", "0", "4294967296", "1108101562368", "283691179835392", "72624976397598720", "145249952795197440", "290499905590394880", "580999811180789760", "0", "1099511627776", "283673999966208", "72624942037860352", "145249884075720704", "290499768151441408", "580999536302882816", "1161999072605765632", "0", "281474976710656", "72620543991349248", "145241087982698496", "290482175965396992", "580964351930793984", "1161928703861587968", "2323857407723175936", "0", "72057594037927936", "144115188075855872", "288230376151711744", "576460752303423488", "1152921504606846976", "2305843009213693952", "4611686018427387904", "0", "0", "0", "0", "0", "0", "0", "0"].map((item) => Long.fromString(item));
    private static D225_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "4", "8", "16", "32", "64", "0", "256", "513", "1026", "2052", "4104", "8208", "16416", "0", "65536", "131328", "262657", "525314", "1050628", "2101256", "4202512", "0", "16777216", "33619968", "67240192", "134480385", "268960770", "537921540", "1075843080", "0", "4294967296", "8606711808", "17213489152", "34426978560", "68853957121", "137707914242", "275415828484", "0", "1099511627776", "2203318222848", "4406653222912", "8813306511360", "17626613022976", "35253226045953", "70506452091906", "0", "281474976710656", "564049465049088", "1128103225065472", "2256206466908160", "4512412933881856", "9024825867763968", "18049651735527937"].map((item) => Long.fromString(item));
    private static D315_MOVES = ["0", "0", "0", "0", "0", "0", "0", "0", "2", "4", "8", "16", "32", "64", "128", "0", "516", "1032", "2064", "4128", "8256", "16512", "32768", "0", "132104", "264208", "528416", "1056832", "2113664", "4227072", "8388608", "0", "33818640", "67637280", "135274560", "270549120", "541097984", "1082130432", "2147483648", "0", "8657571872", "17315143744", "34630287488", "69260574720", "138521083904", "277025390592", "549755813888", "0", "2216338399296", "4432676798592", "8865353596928", "17730707128320", "35461397479424", "70918499991552", "140737488355328", "0", "567382630219904", "1134765260439552", "2269530520813568", "4539061024849920", "9078117754732544", "18155135997837312", "36028797018963968", "0"].map((item) => Long.fromString(item));


    private static pieceToClass = {
        W_ROOKS_CHAR: "w-rook",
        W_KNIGHTS_CHAR: "w-knight",
        W_BISHOPS_CHAR: "w-bishop",
        W_QUEENS_CHAR: "w-queen",
        W_KING_CHAR: "w-king",
        W_PAWNS_CHAR: "w-pawn",
        B_ROOKS_CHAR: "b-rook",
        B_KNIGHTS_CHAR: "b-knight",
        B_BISHOPS_CHAR: "b-bishop",
        B_QUEENS_CHAR: "b-queen",
        B_KING_CHAR: "b-king",
        B_PAWNS_CHAR: "b-pawn"
    };

    public static getPiece(board: IBoardProps, position: number): string {
        var pos = Utils.longPos(position);
        if (board.W_PAWNS.and(pos).notEquals(0)) {
            return GameChar.W_PAWNS_CHAR;
        }
        if (board.W_ROOKS.and(pos).notEquals(0)) {
            return GameChar.W_ROOKS_CHAR;
        }
        if (board.W_KNIGHTS.and(pos).notEquals(0)) {
            return GameChar.W_KNIGHTS_CHAR;
        }
        if (board.W_BISHOPS.and(pos).notEquals(0)) {
            return GameChar.W_BISHOPS_CHAR;
        }
        if (board.W_QUEENS.and(pos).notEquals(0)) {
            return GameChar.W_QUEENS_CHAR;
        }
        if (board.W_KING.and(pos).notEquals(0)) {
            return GameChar.W_KING_CHAR;
        }
        if (board.B_PAWNS.and(pos).notEquals(0)) {
            return GameChar.B_PAWNS_CHAR;
        }
        if (board.B_ROOKS.and(pos).notEquals(0)) {
            return GameChar.B_ROOKS_CHAR;
        }
        if (board.B_KNIGHTS.and(pos).notEquals(0)) {
            return GameChar.B_KNIGHTS_CHAR;
        }
        if (board.B_BISHOPS.and(pos).notEquals(0)) {
            return GameChar.B_BISHOPS_CHAR;
        }
        if (board.B_QUEENS.and(pos).notEquals(0)) {
            return GameChar.B_QUEENS_CHAR;
        }
        if (board.B_KING.and(pos).notEquals(0)) {
            return GameChar.B_KING_CHAR;
        }
        return ""; 
    }

    public static getClassName(piece: string): string {
        if (!piece) return "";

        return this.pieceToClass[piece];
    }

    public static getFutureMove(board: IBoardProps, position: number): number[] {
        var positions = this.getPositions(this.getBoardFutureMove(board, position, true));
        return positions.filter((endPosition) => !this.simulateAndVerifyCheck(position, endPosition));
    }

    private static getPositions(board: Long): number[] {
        var result = [];
        for (var i = 0; i < 64; i++) {
            if (Utils.longPos(i).and(board).notEquals(0)) {
                result.push(i);
            }
        }
        return result;
    }

    private static getBoardFutureMove(board: IBoardProps, position: number, includePawnMovement: boolean): Long {
        var piece = this.getPiece(board, position);

        if (piece === Game.W_KING_CHAR || piece === Game.B_KING_CHAR) {
            var result = this.getFutureMoveKing(Game.KING_MOVES[position]);
            if (position === 4) {
                if (this.blackAttack.and(240).equals(0) && this.occupiedSquares.and(96).equals(0) && (this.whiteCastling & 6) === 0) {
                    result = result.or(64);
                }
                if (this.blackAttack.and(31).equals(0) && this.occupiedSquares.and(14).equals(0) && (this.whiteCastling & 3) === 0) {
                    result = result.or(4);
                }
            }
            if (position === 60) {
                if (this.whiteAttack.and(Long.fromString("17293822569102704640")).equals(0) && this.occupiedSquares.and(Long.fromString("6917529027641081856")).equals(0) && (this.blackCastling & 6) === 0) {
                    result = result.or(Utils.longPos(62));
                }
                if (this.whiteAttack.and(Long.fromString("2233785415175766016")).equals(0) && this.occupiedSquares.and(Long.fromString("1008806316530991104")).equals(0) && (this.blackCastling & 3) === 0) {
                    result = result.or(Utils.longPos(58));
                }
            }
            return result;
        }
        if (piece === BitGameState.W_KNIGHTS_CHAR || piece === BitGameState.B_KNIGHTS_CHAR) {
            return this.getFutureMoveKnight(BitGameState.KNIGHT_MOVES[position]);
        }
        if (piece === BitGameState.W_ROOKS_CHAR || piece === BitGameState.B_ROOKS_CHAR) {
            return this.getFutureMoveRook(BitGameState.RIGHT_MOVES[position], BitGameState.LEFT_MOVES[position], BitGameState.UP_MOVES[position], BitGameState.DOWN_MOVES[position]);
        }
        if (piece === BitGameState.W_BISHOPS_CHAR || piece === BitGameState.B_BISHOPS_CHAR) {
            return this.getFutureMoveBishop(BitGameState.D45_MOVES[position], BitGameState.D135_MOVES[position], BitGameState.D225_MOVES[position], BitGameState.D315_MOVES[position]);
        }
        if (piece === BitGameState.W_QUEENS_CHAR || piece === BitGameState.B_QUEENS_CHAR) {
            var rookMoves = this.getFutureMoveRook(BitGameState.RIGHT_MOVES[position], BitGameState.LEFT_MOVES[position], BitGameState.UP_MOVES[position], BitGameState.DOWN_MOVES[position]);
            var bishopMoves = this.getFutureMoveBishop(BitGameState.D45_MOVES[position], BitGameState.D135_MOVES[position], BitGameState.D225_MOVES[position], BitGameState.D315_MOVES[position]);
            return rookMoves.or(bishopMoves);
        }

        if (piece === BitGameState.W_PAWNS_CHAR) {
            return this.getFutureMovePawn(includePawnMovement ? BitGameState.W_PAWN_FORWARD_MOVES[position] : Long.fromInt(0), includePawnMovement ? BitGameState.W_PAWN_TWO_FORWARD_MOVES[position] : Long.fromInt(0), BitGameState.W_PAWN_ATTACK[position]);
        }
        if (piece === BitGameState.B_PAWNS_CHAR) {
            return this.getFutureMovePawn(includePawnMovement ? BitGameState.B_PAWN_FORWARD_MOVES[position] : Long.fromInt(0), includePawnMovement ? BitGameState.B_PAWN_TWO_FORWARD_MOVES[position] : Long.fromInt(0), BitGameState.B_PAWN_ATTACK[position]);
        }

        return Long.fromInt(0);
    }

    private static getFutureMoveKing(kingMoves: Long): Long {
        return kingMoves.and(this.enemyEmptySquares);
    }

}*/