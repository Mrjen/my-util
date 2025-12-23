// 定义键位分类
export const KeyCategory = {
  Letter: "letter", // 字母键
  Number: "number", // 数字键
  Function: "function", // 功能键 F1-F24
  Navigation: "navigation", // 导航键 方向键等
  Editing: "editing", // 编辑键 Enter、Backspace等
  Symbol: "symbol", // 符号键 -=[]等
  Modifier: "modifier", // 修饰键 Ctrl、Alt等
  NumPad: "numpad", // 数字小键盘
  System: "system", // 系统键 PrintScreen等
  Extra: "extra",
  Media: "media", // 媒体键
  Fn: "fn", // fn键
  Blank: "blank", // 空白键
} as const

export type KeyCategory = (typeof KeyCategory)[keyof typeof KeyCategory]

export interface IKeyHidMapItem {
  hidCode: number
  keyValue: number
  keyChar: string
  displayString: string
  category: KeyCategory
  scanCode?: string
}

export class KeyHidMap {
  static get KeyA(): IKeyHidMapItem {
    return {
      hidCode: 4,
      keyValue: 65,
      scanCode: "1e",
      keyChar: "KeyA",
      displayString: "A",
      category: KeyCategory.Letter,
    }
  }

  static get KeyB(): IKeyHidMapItem {
    return {
      hidCode: 5,
      keyValue: 66,
      scanCode: "30",
      keyChar: "KeyB",
      displayString: "B",
      category: KeyCategory.Letter,
    }
  }

  static get KeyC(): IKeyHidMapItem {
    return {
      hidCode: 6,
      keyValue: 67,
      scanCode: "2e",
      keyChar: "KeyC",
      displayString: "C",
      category: KeyCategory.Letter,
    }
  }

  static get KeyD(): IKeyHidMapItem {
    return {
      hidCode: 7,
      keyValue: 68,
      scanCode: "20",
      keyChar: "KeyD",
      displayString: "D",
      category: KeyCategory.Letter,
    }
  }

  static get KeyE(): IKeyHidMapItem {
    return {
      hidCode: 8,
      keyValue: 69,
      scanCode: "12",
      keyChar: "KeyE",
      displayString: "E",
      category: KeyCategory.Letter,
    }
  }

  static get KeyF(): IKeyHidMapItem {
    return {
      hidCode: 9,
      keyValue: 70,
      scanCode: "21",
      keyChar: "KeyF",
      displayString: "F",
      category: KeyCategory.Letter,
    }
  }

  static get KeyG(): IKeyHidMapItem {
    return {
      hidCode: 10,
      keyValue: 71,
      scanCode: "22",
      keyChar: "KeyG",
      displayString: "G",
      category: KeyCategory.Letter,
    }
  }

  static get KeyH(): IKeyHidMapItem {
    return {
      hidCode: 11,
      keyValue: 72,
      scanCode: "23",
      keyChar: "KeyH",
      displayString: "H",
      category: KeyCategory.Letter,
    }
  }

  static get KeyI(): IKeyHidMapItem {
    return {
      hidCode: 12,
      keyValue: 73,
      scanCode: "17",
      keyChar: "KeyI",
      displayString: "I",
      category: KeyCategory.Letter,
    }
  }

  static get KeyJ(): IKeyHidMapItem {
    return {
      hidCode: 13,
      keyValue: 74,
      scanCode: "24",
      keyChar: "KeyJ",
      displayString: "J",
      category: KeyCategory.Letter,
    }
  }

  static get KeyK(): IKeyHidMapItem {
    return {
      hidCode: 14,
      keyValue: 75,
      scanCode: "25",
      keyChar: "KeyK",
      displayString: "K",
      category: KeyCategory.Letter,
    }
  }

  static get KeyL(): IKeyHidMapItem {
    return {
      hidCode: 15,
      keyValue: 76,
      scanCode: "26",
      keyChar: "KeyL",
      displayString: "L",
      category: KeyCategory.Letter,
    }
  }

  static get KeyM(): IKeyHidMapItem {
    return {
      hidCode: 16,
      keyValue: 77,
      scanCode: "32",
      keyChar: "KeyM",
      displayString: "M",
      category: KeyCategory.Letter,
    }
  }

  static get KeyN(): IKeyHidMapItem {
    return {
      hidCode: 17,
      keyValue: 78,
      scanCode: "31",
      keyChar: "KeyN",
      displayString: "N",
      category: KeyCategory.Letter,
    }
  }

  static get KeyO(): IKeyHidMapItem {
    return {
      hidCode: 18,
      keyValue: 79,
      scanCode: "18",
      keyChar: "KeyO",
      displayString: "O",
      category: KeyCategory.Letter,
    }
  }

  static get KeyP(): IKeyHidMapItem {
    return {
      hidCode: 19,
      keyValue: 80,
      scanCode: "19",
      keyChar: "KeyP",
      displayString: "P",
      category: KeyCategory.Letter,
    }
  }

  static get KeyQ(): IKeyHidMapItem {
    return {
      hidCode: 20,
      keyValue: 81,
      scanCode: "10",
      keyChar: "KeyQ",
      displayString: "Q",
      category: KeyCategory.Letter,
    }
  }

  static get KeyR(): IKeyHidMapItem {
    return {
      hidCode: 21,
      keyValue: 82,
      scanCode: "13",
      keyChar: "KeyR",
      displayString: "R",
      category: KeyCategory.Letter,
    }
  }

  static get KeyS(): IKeyHidMapItem {
    return {
      hidCode: 22,
      keyValue: 83,
      scanCode: "1f",
      keyChar: "KeyS",
      displayString: "S",
      category: KeyCategory.Letter,
    }
  }

  static get KeyT(): IKeyHidMapItem {
    return {
      hidCode: 23,
      keyValue: 84,
      scanCode: "14",
      keyChar: "KeyT",
      displayString: "T",
      category: KeyCategory.Letter,
    }
  }

  static get KeyU(): IKeyHidMapItem {
    return {
      hidCode: 24,
      keyValue: 85,
      scanCode: "16",
      keyChar: "KeyU",
      displayString: "U",
      category: KeyCategory.Letter,
    }
  }

  static get KeyV(): IKeyHidMapItem {
    return {
      hidCode: 25,
      keyValue: 86,
      scanCode: "2f",
      keyChar: "KeyV",
      displayString: "V",
      category: KeyCategory.Letter,
    }
  }

  static get KeyW(): IKeyHidMapItem {
    return {
      hidCode: 26,
      keyValue: 87,
      scanCode: "11",
      keyChar: "KeyW",
      displayString: "W",
      category: KeyCategory.Letter,
    }
  }

  static get KeyX(): IKeyHidMapItem {
    return {
      hidCode: 27,
      keyValue: 88,
      scanCode: "2d",
      keyChar: "KeyX",
      displayString: "X",
      category: KeyCategory.Letter,
    }
  }

  static get KeyY(): IKeyHidMapItem {
    return {
      hidCode: 28,
      keyValue: 89,
      scanCode: "15",
      keyChar: "KeyY",
      displayString: "Y",
      category: KeyCategory.Letter,
    }
  }

  static get KeyZ(): IKeyHidMapItem {
    return {
      hidCode: 29,
      keyValue: 90,
      scanCode: "2c",
      keyChar: "KeyZ",
      displayString: "Z",
      category: KeyCategory.Letter,
    }
  }

  static get Digit0(): IKeyHidMapItem {
    return {
      hidCode: 39,
      keyValue: 48,
      scanCode: "52",
      keyChar: "Digit0",
      displayString: "0",
      category: KeyCategory.Number,
    }
  }

  static get Digit1(): IKeyHidMapItem {
    return {
      hidCode: 30,
      keyValue: 49,
      scanCode: "4F",
      keyChar: "Digit1",
      displayString: "1",
      category: KeyCategory.Number,
    }
  }

  static get Digit2(): IKeyHidMapItem {
    return {
      hidCode: 31,
      keyValue: 50,
      scanCode: "50",
      keyChar: "Digit2",
      displayString: "2",
      category: KeyCategory.Number,
    }
  }

  static get Digit3(): IKeyHidMapItem {
    return {
      hidCode: 32,
      keyValue: 51,
      scanCode: "51",
      keyChar: "Digit3",
      displayString: "3",
      category: KeyCategory.Number,
    }
  }

  static get Digit4(): IKeyHidMapItem {
    return {
      hidCode: 33,
      keyValue: 52,
      scanCode: "4B",
      keyChar: "Digit4",
      displayString: "4",
      category: KeyCategory.Number,
    }
  }

  static get Digit5(): IKeyHidMapItem {
    return {
      hidCode: 34,
      keyValue: 53,
      scanCode: "4C",
      keyChar: "Digit5",
      displayString: "5",
      category: KeyCategory.Number,
    }
  }

  static get Digit6(): IKeyHidMapItem {
    return {
      hidCode: 35,
      keyValue: 54,
      scanCode: "4D",
      keyChar: "Digit6",
      displayString: "6",
      category: KeyCategory.Number,
    }
  }

  static get Digit7(): IKeyHidMapItem {
    return {
      hidCode: 36,
      keyValue: 55,
      scanCode: "47",
      keyChar: "Digit7",
      displayString: "7",
      category: KeyCategory.Number,
    }
  }

  static get Digit8(): IKeyHidMapItem {
    return {
      hidCode: 37,
      keyValue: 56,
      scanCode: "48",
      keyChar: "Digit8",
      displayString: "8",
      category: KeyCategory.Number,
    }
  }

  static get Digit9(): IKeyHidMapItem {
    return {
      hidCode: 38,
      keyValue: 57,
      scanCode: "49",
      keyChar: "Digit9",
      displayString: "9",
      category: KeyCategory.Number,
    }
  }

  static get Enter(): IKeyHidMapItem {
    return {
      hidCode: 40,
      keyValue: 13,
      scanCode: "1C",
      keyChar: "Enter",
      displayString: "Enter",
      category: KeyCategory.Editing,
    }
  }

  static get NumpadEnter(): IKeyHidMapItem {
    return {
      hidCode: 88,
      keyValue: 13,
      scanCode: "e0-1c",
      keyChar: "NumpadEnter",
      displayString: "Enter",
      category: KeyCategory.NumPad,
    }
  }

  static get NumpadPeriod(): IKeyHidMapItem {
    return {
      hidCode: 99,
      keyValue: 110,
      scanCode: "53",
      keyChar: "NumpadPeriod",
      displayString: ".",
      category: KeyCategory.NumPad,
    }
  }

  static get Escape(): IKeyHidMapItem {
    return {
      hidCode: 41,
      keyValue: 27,
      scanCode: "01",
      keyChar: "Escape",
      displayString: "Esc",
      category: KeyCategory.Extra,
    }
  }

  static get Backspace(): IKeyHidMapItem {
    return {
      hidCode: 42,
      keyValue: 8,
      scanCode: "0e",
      keyChar: "Backspace",
      displayString: "Backspace",
      category: KeyCategory.Editing,
    }
  }

  static get Tab(): IKeyHidMapItem {
    return {
      hidCode: 43,
      keyValue: 9,
      scanCode: "0f",
      keyChar: "Tab",
      displayString: "Tab",
      category: KeyCategory.Extra,
    }
  }

  static get Space(): IKeyHidMapItem {
    return {
      hidCode: 44,
      keyValue: 32,
      scanCode: "39",
      keyChar: "Space",
      displayString: "Space",
      category: KeyCategory.Editing,
    }
  }

  static get Minus(): IKeyHidMapItem {
    return {
      hidCode: 45,
      keyValue: 189,
      scanCode: "0c",
      keyChar: "Minus",
      displayString: "-",
      category: KeyCategory.Symbol,
    }
  }

  static get NumpadSubtract(): IKeyHidMapItem {
    return {
      hidCode: 86,
      keyValue: 109,
      scanCode: "e0-35",
      keyChar: "NumpadSubtract",
      displayString: "-",
      category: KeyCategory.Symbol,
    }
  }

  static get Equal(): IKeyHidMapItem {
    return {
      hidCode: 46,
      keyValue: 187,
      scanCode: "0d",
      keyChar: "Equal",
      displayString: "=",
      category: KeyCategory.Symbol,
    }
  }

  static get BracketLeft(): IKeyHidMapItem {
    return {
      hidCode: 47,
      keyValue: 219,
      scanCode: "1a",
      keyChar: "BracketLeft",
      displayString: "[",
      category: KeyCategory.Symbol,
    }
  }

  static get BracketRight(): IKeyHidMapItem {
    return {
      hidCode: 48,
      keyValue: 221,
      scanCode: "1b",
      keyChar: "BracketRight",
      displayString: "]",
      category: KeyCategory.Symbol,
    }
  }

  static get Backslash(): IKeyHidMapItem {
    return {
      hidCode: 49,
      keyValue: 220,
      scanCode: "2b",
      keyChar: "Backslash",
      displayString: "\\",
      category: KeyCategory.Symbol,
    }
  }

  static get Semicolon(): IKeyHidMapItem {
    return {
      hidCode: 51,
      keyValue: 186,
      scanCode: "27",
      keyChar: "Semicolon",
      displayString: ";",
      category: KeyCategory.Symbol,
    }
  }

  static get Quote(): IKeyHidMapItem {
    return {
      hidCode: 52,
      keyValue: 222,
      scanCode: "28",
      keyChar: "Quote",
      displayString: "'",
      category: KeyCategory.Symbol,
    }
  }

  static get Comma(): IKeyHidMapItem {
    return {
      hidCode: 54,
      keyValue: 188,
      scanCode: "33",
      keyChar: "Comma",
      displayString: ",",
      category: KeyCategory.Symbol,
    }
  }

  static get Period(): IKeyHidMapItem {
    return {
      hidCode: 55,
      keyValue: 190,
      scanCode: "34",
      keyChar: "Period",
      displayString: ".",
      category: KeyCategory.Symbol,
    }
  }

  static get Slash(): IKeyHidMapItem {
    return {
      hidCode: 56,
      keyValue: 191,
      scanCode: "35",
      keyChar: "Slash",
      displayString: "/",
      category: KeyCategory.Symbol,
    }
  }

  static get Backquote(): IKeyHidMapItem {
    return {
      hidCode: 53,
      keyValue: 192,
      scanCode: "29",
      keyChar: "Backquote",
      displayString: "`",
      category: KeyCategory.Symbol,
    }
  }

  static get CapsLock(): IKeyHidMapItem {
    return {
      hidCode: 57,
      keyValue: 20,
      scanCode: "3a",
      keyChar: "CapsLock",
      displayString: "CapsLk",
      category: KeyCategory.Modifier,
    }
  }

  static get F1(): IKeyHidMapItem {
    return {
      hidCode: 58,
      keyValue: 112,
      scanCode: "3b",
      keyChar: "F1",
      displayString: "F1",
      category: KeyCategory.Extra,
    }
  }

  static get F2(): IKeyHidMapItem {
    return {
      hidCode: 59,
      keyValue: 113,
      scanCode: "3c",
      keyChar: "F2",
      displayString: "F2",
      category: KeyCategory.Extra,
    }
  }

  static get F3(): IKeyHidMapItem {
    return {
      hidCode: 60,
      keyValue: 114,
      scanCode: "3d",
      keyChar: "F3",
      displayString: "F3",
      category: KeyCategory.Extra,
    }
  }

  static get F4(): IKeyHidMapItem {
    return {
      hidCode: 61,
      keyValue: 115,
      scanCode: "3e",
      keyChar: "F4",
      displayString: "F4",
      category: KeyCategory.Extra,
    }
  }

  static get F5(): IKeyHidMapItem {
    return {
      hidCode: 62,
      keyValue: 116,
      scanCode: "3f",
      keyChar: "F5",
      displayString: "F5",
      category: KeyCategory.Extra,
    }
  }

  static get F6(): IKeyHidMapItem {
    return {
      hidCode: 63,
      keyValue: 117,
      scanCode: "40",
      keyChar: "F6",
      displayString: "F6",
      category: KeyCategory.Extra,
    }
  }

  static get F7(): IKeyHidMapItem {
    return {
      hidCode: 64,
      keyValue: 118,
      scanCode: "41",
      keyChar: "F7",
      displayString: "F7",
      category: KeyCategory.Extra,
    }
  }

  static get F8(): IKeyHidMapItem {
    return {
      hidCode: 65,
      keyValue: 119,
      scanCode: "42",
      keyChar: "F8",
      displayString: "F8",
      category: KeyCategory.Extra,
    }
  }

  static get F9(): IKeyHidMapItem {
    return {
      hidCode: 66,
      keyValue: 120,
      scanCode: "43",
      keyChar: "F9",
      displayString: "F9",
      category: KeyCategory.Extra,
    }
  }

  static get F10(): IKeyHidMapItem {
    return {
      hidCode: 67,
      keyValue: 121,
      scanCode: "44",
      keyChar: "F10",
      displayString: "F10",
      category: KeyCategory.Extra,
    }
  }

  static get F11(): IKeyHidMapItem {
    return {
      hidCode: 68,
      keyValue: 122,
      scanCode: "57",
      keyChar: "F11",
      displayString: "F11",
      category: KeyCategory.Extra,
    }
  }

  static get F12(): IKeyHidMapItem {
    return {
      hidCode: 69,
      keyValue: 123,
      scanCode: "58",
      keyChar: "F12",
      displayString: "F12",
      category: KeyCategory.Extra,
    }
  }

  static get ControlLeft(): IKeyHidMapItem {
    return {
      hidCode: 224,
      keyValue: 17,
      scanCode: "1d",
      keyChar: "ControlLeft",
      displayString: "L-Ctrl",
      category: KeyCategory.Modifier,
    }
  }

  static get ControlRight(): IKeyHidMapItem {
    return {
      hidCode: 228,
      keyValue: 17,
      scanCode: "1d-e0",
      keyChar: "ControlRight",
      displayString: "R-Ctrl",
      category: KeyCategory.Modifier,
    }
  }

  static get AltLeft(): IKeyHidMapItem {
    return {
      hidCode: 226,
      keyValue: 18,
      scanCode: "38",
      keyChar: "AltLeft",
      displayString: "L-Alt",
      category: KeyCategory.Modifier,
    }
  }

  static get AltRight(): IKeyHidMapItem {
    return {
      hidCode: 230,
      keyValue: 18,
      scanCode: "38-e0",
      keyChar: "AltRight",
      displayString: "R-Alt",
      category: KeyCategory.Modifier,
    }
  }

  static get MetaLeft(): IKeyHidMapItem {
    return {
      hidCode: 227,
      keyValue: 91,
      scanCode: "5b-e0",
      keyChar: "MetaLeft",
      displayString: "L-Win",
      category: KeyCategory.Modifier,
    }
  }

  static get MetaRight(): IKeyHidMapItem {
    return {
      hidCode: 231,
      keyValue: 92,
      scanCode: "5c-e0",
      keyChar: "MetaRight",
      displayString: "R-Win",
      category: KeyCategory.Modifier,
    }
  }

  static get ArrowUp(): IKeyHidMapItem {
    return {
      hidCode: 82,
      keyValue: 38,
      scanCode: "48-e0",
      keyChar: "ArrowUp",
      displayString: "↑",
      category: KeyCategory.Navigation,
    }
  }

  static get ArrowDown(): IKeyHidMapItem {
    return {
      hidCode: 81,
      keyValue: 40,
      scanCode: "50-e0",
      keyChar: "ArrowDown",
      displayString: "↓",
      category: KeyCategory.Navigation,
    }
  }

  static get ArrowLeft(): IKeyHidMapItem {
    return {
      hidCode: 80,
      keyValue: 37,
      scanCode: "4b-e0",
      keyChar: "ArrowLeft",
      displayString: "←",
      category: KeyCategory.Navigation,
    }
  }

  static get ArrowRight(): IKeyHidMapItem {
    return {
      hidCode: 79,
      keyValue: 39,
      scanCode: "4d-e0",
      keyChar: "ArrowRight",
      displayString: "→",
      category: KeyCategory.Navigation,
    }
  }

  static get NumLock(): IKeyHidMapItem {
    return {
      hidCode: 83,
      keyValue: 144,
      scanCode: "45",
      keyChar: "NumLock",
      displayString: "Num",
      category: KeyCategory.System,
    }
  }

  static get ScrollLock(): IKeyHidMapItem {
    return {
      hidCode: 71,
      keyValue: 145,
      scanCode: "46",
      keyChar: "ScrollLock",
      displayString: "ScrLk",
      category: KeyCategory.System,
    }
  }

  static get PrintScreen(): IKeyHidMapItem {
    return {
      hidCode: 70,
      keyValue: 44,
      scanCode: "37-e0",
      keyChar: "PrintScreen",
      displayString: "PrtSc",
      category: KeyCategory.System,
    }
  }

  static get Insert(): IKeyHidMapItem {
    return {
      hidCode: 73,
      keyValue: 45,
      scanCode: "52-e0",
      keyChar: "Insert",
      displayString: "Ins",
      category: KeyCategory.Editing,
    }
  }

  static get Delete(): IKeyHidMapItem {
    return {
      hidCode: 76,
      keyValue: 46,
      scanCode: "53-e0",
      keyChar: "Delete",
      displayString: "Del",
      category: KeyCategory.Editing,
    }
  }

  static get Home(): IKeyHidMapItem {
    return {
      hidCode: 74,
      keyValue: 36,
      scanCode: "47-e0",
      keyChar: "Home",
      displayString: "Home",
      category: KeyCategory.Navigation,
    }
  }

  static get End(): IKeyHidMapItem {
    return {
      hidCode: 77,
      keyValue: 35,
      scanCode: "4f-e0",
      keyChar: "End",
      displayString: "End",
      category: KeyCategory.Navigation,
    }
  }

  static get PageUp(): IKeyHidMapItem {
    return {
      hidCode: 75,
      keyValue: 33,
      scanCode: "49-e0",
      keyChar: "PageUp",
      displayString: "PgUp",
      category: KeyCategory.Navigation,
    }
  }

  static get PageDown(): IKeyHidMapItem {
    return {
      hidCode: 78,
      keyValue: 34,
      scanCode: "51-e0",
      keyChar: "PageDown",
      displayString: "PgDn",
      category: KeyCategory.Navigation,
    }
  }

  static get Numpad0(): IKeyHidMapItem {
    return {
      hidCode: 98,
      keyValue: 96,
      scanCode: "52",
      keyChar: "Numpad0",
      displayString: "0",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad1(): IKeyHidMapItem {
    return {
      hidCode: 89,
      keyValue: 97,
      scanCode: "4f",
      keyChar: "Numpad1",
      displayString: "1",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad2(): IKeyHidMapItem {
    return {
      hidCode: 90,
      keyValue: 98,
      scanCode: "50",
      keyChar: "Numpad2",
      displayString: "2",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad3(): IKeyHidMapItem {
    return {
      hidCode: 91,
      keyValue: 99,
      scanCode: "51",
      keyChar: "Numpad3",
      displayString: "3",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad4(): IKeyHidMapItem {
    return {
      hidCode: 92,
      keyValue: 100,
      scanCode: "4b",
      keyChar: "Numpad4",
      displayString: "4",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad5(): IKeyHidMapItem {
    return {
      hidCode: 93,
      keyValue: 101,
      scanCode: "4c",
      keyChar: "Numpad5",
      displayString: "5",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad6(): IKeyHidMapItem {
    return {
      hidCode: 94,
      keyValue: 102,
      scanCode: "4d",
      keyChar: "Numpad6",
      displayString: "6",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad7(): IKeyHidMapItem {
    return {
      hidCode: 95,
      keyValue: 103,
      scanCode: "47",
      keyChar: "Numpad7",
      displayString: "7",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad8(): IKeyHidMapItem {
    return {
      hidCode: 96,
      keyValue: 104,
      scanCode: "48",
      keyChar: "Numpad8",
      displayString: "8",
      category: KeyCategory.NumPad,
    }
  }

  static get Numpad9(): IKeyHidMapItem {
    return {
      hidCode: 97,
      keyValue: 105,
      scanCode: "49",
      keyChar: "Numpad9",
      displayString: "9",
      category: KeyCategory.NumPad,
    }
  }

  static get NumpadAdd(): IKeyHidMapItem {
    return {
      hidCode: 87,
      keyValue: 107,
      scanCode: "4e",
      keyChar: "NumpadAdd",
      displayString: "+",
      category: KeyCategory.Symbol,
    }
  }

  static get NumpadMultiply(): IKeyHidMapItem {
    return {
      hidCode: 85,
      keyValue: 106,
      scanCode: "37",
      keyChar: "NumpadMultiply",
      displayString: "*",
      category: KeyCategory.Symbol,
    }
  }

  static get NumpadDivide(): IKeyHidMapItem {
    return {
      hidCode: 84,
      keyValue: 111,
      scanCode: "e0-35",
      keyChar: "NumpadDivide",
      displayString: "/",
      category: KeyCategory.Symbol,
    }
  }

  static get Pause(): IKeyHidMapItem {
    return {
      hidCode: 72,
      keyValue: 19,
      scanCode: "66",
      keyChar: "Pause",
      displayString: "Pause", // F15
      category: KeyCategory.System,
    }
  }

  static get ShiftLeft(): IKeyHidMapItem {
    return {
      hidCode: 225,
      keyValue: 16,
      scanCode: "2a",
      keyChar: "ShiftLeft",
      displayString: "L-Shift",
      category: KeyCategory.Modifier,
    }
  }

  static get ShiftRight(): IKeyHidMapItem {
    return {
      hidCode: 229,
      keyValue: 16,
      scanCode: "36",
      keyChar: "ShiftRight",
      displayString: "R-Shift",
      category: KeyCategory.Modifier,
    }
  }

  static get Menu(): IKeyHidMapItem {
    return {
      hidCode: 101,
      keyValue: 93,
      scanCode: "5d-e0",
      keyChar: "Menu",
      displayString: "Menu",
      category: KeyCategory.Modifier,
    }
  }

  static get Fn1(): IKeyHidMapItem {
    return {
      hidCode: 223,
      keyValue: NaN,
      keyChar: "Fn1",
      displayString: "Fn 1",
      category: KeyCategory.Fn,
      scanCode: "",
    }
  }

  static get AudioVolumeMute(): IKeyHidMapItem {
    return {
      hidCode: 226,
      keyValue: 173,
      keyChar: "AudioVolumeMute",
      displayString: "AudioVolumeMute",
      category: KeyCategory.Media,
    }
  }

  static get AudioVolumeDown(): IKeyHidMapItem {
    return {
      hidCode: 234,
      keyValue: 174,
      keyChar: "AudioVolumeDown",
      displayString: "AudioVolumeDown",
      category: KeyCategory.Media,
    }
  }

  static get AudioVolumeUp(): IKeyHidMapItem {
    return {
      hidCode: 233,
      keyValue: 175,
      keyChar: "AudioVolumeUp",
      displayString: "AudioVolumeUp",
      category: KeyCategory.Media,
    }
  }

  static get MediaTrackNext(): IKeyHidMapItem {
    return {
      hidCode: 181,
      keyValue: 176,
      keyChar: "MediaTrackNext",
      displayString: "MediaTrackNext",
      category: KeyCategory.Media,
    }
  }

  static get MediaTrackPrevious(): IKeyHidMapItem {
    return {
      hidCode: 182,
      keyValue: 177,
      keyChar: "MediaTrackPrevious",
      displayString: "MediaTrackPrevious",
      category: KeyCategory.Media,
    }
  }

  static get MediaPlayPause(): IKeyHidMapItem {
    return {
      hidCode: 205,
      keyValue: 179,
      keyChar: "MediaPlayPause",
      displayString: "MediaPlayPause",
      category: KeyCategory.Media,
    }
  }

  static get MediaStop(): IKeyHidMapItem {
    return {
      hidCode: 183,
      keyValue: 178,
      keyChar: "MediaStop",
      displayString: "MediaStop",
      category: KeyCategory.Media,
    }
  }

  // 空白键
  static get KeyBlank(): IKeyHidMapItem {
    return {
      hidCode: 222,
      keyValue: NaN,
      scanCode: "",
      keyChar: "KeyBlank",
      displayString: "Blank",
      category: KeyCategory.Blank,
    }
  }

  static get all(): IKeyHidMapItem[] {
    return [
      KeyHidMap.KeyA,
      KeyHidMap.KeyB,
      KeyHidMap.KeyC,
      KeyHidMap.KeyD,
      KeyHidMap.KeyE,
      KeyHidMap.KeyF,
      KeyHidMap.KeyG,
      KeyHidMap.KeyH,
      KeyHidMap.KeyI,
      KeyHidMap.KeyJ,
      KeyHidMap.KeyK,
      KeyHidMap.KeyL,
      KeyHidMap.KeyM,
      KeyHidMap.KeyN,
      KeyHidMap.KeyO,
      KeyHidMap.KeyP,
      KeyHidMap.KeyQ,
      KeyHidMap.KeyR,
      KeyHidMap.KeyS,
      KeyHidMap.KeyT,
      KeyHidMap.KeyU,
      KeyHidMap.KeyV,
      KeyHidMap.KeyW,
      KeyHidMap.KeyX,
      KeyHidMap.KeyY,
      KeyHidMap.KeyZ,
      KeyHidMap.Digit0,
      KeyHidMap.Digit1,
      KeyHidMap.Digit2,
      KeyHidMap.Digit3,
      KeyHidMap.Digit4,
      KeyHidMap.Digit5,
      KeyHidMap.Digit6,
      KeyHidMap.Digit7,
      KeyHidMap.Digit8,
      KeyHidMap.Digit9,
      KeyHidMap.Enter,
      KeyHidMap.NumpadEnter,
      KeyHidMap.NumpadPeriod,
      KeyHidMap.NumpadDivide,
      KeyHidMap.Escape,
      KeyHidMap.Backspace,
      KeyHidMap.Tab,
      KeyHidMap.Space,
      KeyHidMap.Minus,
      KeyHidMap.NumpadSubtract,
      KeyHidMap.Equal,
      KeyHidMap.BracketLeft,
      KeyHidMap.BracketRight,
      KeyHidMap.Backslash,
      KeyHidMap.Semicolon,
      KeyHidMap.Quote,
      KeyHidMap.Comma,
      KeyHidMap.Period,
      KeyHidMap.Slash,
      KeyHidMap.Backquote,
      KeyHidMap.CapsLock,
      KeyHidMap.F1,
      KeyHidMap.F2,
      KeyHidMap.F3,
      KeyHidMap.F4,
      KeyHidMap.F5,
      KeyHidMap.F6,
      KeyHidMap.F7,
      KeyHidMap.F8,
      KeyHidMap.F9,
      KeyHidMap.F10,
      KeyHidMap.F11,
      KeyHidMap.F12,
      KeyHidMap.ControlLeft,
      KeyHidMap.ControlRight,
      KeyHidMap.AltLeft,
      KeyHidMap.AltRight,
      KeyHidMap.MetaLeft,
      KeyHidMap.MetaRight,
      KeyHidMap.ArrowUp,
      KeyHidMap.ArrowDown,
      KeyHidMap.ArrowLeft,
      KeyHidMap.ArrowRight,
      KeyHidMap.NumLock,
      KeyHidMap.ScrollLock,
      KeyHidMap.PrintScreen,
      KeyHidMap.Insert,
      KeyHidMap.Delete,
      KeyHidMap.Home,
      KeyHidMap.End,
      KeyHidMap.PageUp,
      KeyHidMap.PageDown,
      KeyHidMap.Numpad0,
      KeyHidMap.Numpad1,
      KeyHidMap.Numpad2,
      KeyHidMap.Numpad3,
      KeyHidMap.Numpad4,
      KeyHidMap.Numpad5,
      KeyHidMap.Numpad6,
      KeyHidMap.Numpad7,
      KeyHidMap.Numpad8,
      KeyHidMap.Numpad9,
      KeyHidMap.NumpadAdd,
      KeyHidMap.NumpadMultiply,
      KeyHidMap.ShiftLeft,
      KeyHidMap.ShiftRight,
      KeyHidMap.Menu,
      KeyHidMap.Fn1,
      KeyHidMap.Pause,
      KeyHidMap.AudioVolumeMute,
      KeyHidMap.AudioVolumeDown,
      KeyHidMap.AudioVolumeUp,
      KeyHidMap.MediaTrackNext,
      KeyHidMap.MediaTrackPrevious,
      KeyHidMap.MediaPlayPause,
      KeyHidMap.MediaStop,
    ]
  }

  // 添加一个获取按分类的键位的静态方法
  static getKeysByCategory(category: KeyCategory) {
    return KeyHidMap.all.filter((key) => key.category === category)
  }

  // 获取所有分类
  static get categories() {
    return Object.values(KeyCategory)
  }

  // 通过HID获取键位
  static getKeyByHid(hid: number) {
    return KeyHidMap.all.find((key) => key.hidCode === hid)
  }

  // 通过keyName获取键位
  static getKeyByName(keyName: string): IKeyHidMapItem | undefined {
    return KeyHidMap.all.find((key) => key.keyChar === keyName)
  }

  // 通过keyValue获取键位
  static getKeyByKeyValue(keyValue: number): IKeyHidMapItem {
    return KeyHidMap.all.find((key) => key.keyValue === keyValue)!
  }
}
