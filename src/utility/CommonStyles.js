import { Fonts,Colors } from "../assets";
import FontSize from "./FontSize";
import UtilityMethods from "./UtilityMethods";

const { StyleSheet, Platform } = require("react-native");

const CommonStyles = StyleSheet.create({
    BOLD:{
        fontWeight:Platform.OS=="ios"?'600':null,
        fontFamily:Fonts.BOLD,
    },
    MEDIUM:{
        fontWeight:"500",
        fontFamily:Fonts.MEDIUM,
    },
    REGULAR:{
        fontWeight:"400",
        fontFamily:Fonts.REGULAR,
    },
    REGULAR_TEXT:{
        fontWeight:"400",
        fontFamily:Fonts.REGULAR,
        fontSize:FontSize.VALUE(16),
        color:Colors.BLACK

    },
    BOLD_TEXT:{
        fontWeight:"600",
        fontFamily:Fonts.BOLD,
        fontSize:FontSize.VALUE(18),
        color:Colors.BLACK
    },
    MEDIUM_TEXT:{
        fontWeight:"500",
        fontFamily:Fonts.MEDIUM,
        fontSize:FontSize.VALUE(14),
        color:Colors.BLACK
    },
    MARGIN_FROM_BOTTOM:{
        marginTop:"40",
        marginBottom:UtilityMethods.hp(2), 
    },
    MARGIN_FROM_BOTTOM_WITH_NOSH:{
        marginTop:"auto",
        marginBottom:UtilityMethods.hasNotch() ? UtilityMethods.hp(5) : UtilityMethods.hp(2), 
    }


});

export default CommonStyles;