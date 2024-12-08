import { PluginKey, Plugin } from "prosemirror-state";
import { findParentDomRefOfType, setTextSelection } from "prosemirror-utils";
import { Node, Fragment, Slice, Schema } from "prosemirror-model";
import { ReplaceStep } from "prosemirror-transform";
import Color from "color";
import { TableMap, tableNodes } from "prosemirror-tables";

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

var PAGE = "page";
var BLOCKQUOTE = "blockquote";
var BULLET_LIST = "bullet_list";
var ORDERED_LIST = "ordered_list";
var CODE_BLOCK = "code_block";
var DOC = "doc";
var HARD_BREAK = "hard_break";
var HEADING = "heading";
var HORIZONTAL_RULE = "horizontal_rule";
var IMAGE = "image";
var LIST_ITEM = "list_item";
var PARAGRAPH = "paragraph";
var TABLE = "table";
var TEXT = "text";
var HEADER = "header";
var FOOTER = "footer";
var BODY = "body";
var END = "end";
var START = "start";
var PAGE_COUNTER = "page_counter";

var RGBA_PATTERN = /^rgba/i;
var RGBA_TRANSPARENT = "rgba(0,0,0,0)";
var ColorMaping = {
  transparent: RGBA_TRANSPARENT,
  inherit: "",
};
function isTransparent(source) {
  if (!source) {
    return true;
  }
  var hex = toCSSColor(source);
  return !hex || hex === RGBA_TRANSPARENT;
}
function toCSSColor(source) {
  if (!source) {
    return "";
  }
  if (source in ColorMaping) {
    return ColorMaping[source];
  }
  if (source && RGBA_PATTERN.test(source)) {
    var color = Color(source);
    if (color.valpha === 0) {
      ColorMaping[source] = RGBA_TRANSPARENT;
      return RGBA_TRANSPARENT;
    }
    var rgba = color.toString();
    ColorMaping[source] = rgba.toString();
    return rgba;
  }
  var hex = "";
  try {
    hex = Color(source).hex().toLowerCase();
    ColorMaping[source] = hex;
  } catch (ex) {
    console.warn("unable to convert to hex", source);
    ColorMaping[source] = "";
  }
  return hex;
}

var rgbToHex = function (r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(function (x) {
        var hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

var FONT_PT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];

var SIZE_PATTERN = /([\d\.]+)(px|pt)/i;
var PX_TO_PT_RATIO = 0.7518796992481203; // 1 / 1.33.
function convertToCSSPTValue(styleValue) {
  var matches = styleValue.match(SIZE_PATTERN);
  if (!matches) {
    return 0;
  }
  var value = parseFloat(matches[1]);
  var unit = matches[2];
  if (!value || !unit) {
    return 0;
  }
  if (unit === "px") {
    value = PX_TO_PT_RATIO * value;
  }
  return value;
}
function toClosestFontPtSize(styleValue) {
  var originalPTValue = convertToCSSPTValue(styleValue);
  if (FONT_PT_SIZES.includes(originalPTValue)) {
    return originalPTValue;
  }
  return FONT_PT_SIZES.reduce(function (prev, curr) {
    return Math.abs(curr - originalPTValue) < Math.abs(prev - originalPTValue)
      ? curr
      : prev;
  }, Number.NEGATIVE_INFINITY);
}

var WebFontLoader = /** @class */ (function () {
  function WebFontLoader() {
    this._implementation = null;
  }
  WebFontLoader.prototype.setImplementation = function (impl) {
    this._implementation = impl;
  };
  WebFontLoader.prototype.load = function (params) {
    var impl = this._implementation;
    if (impl) {
      impl.load(params);
    } else {
      console.warn("Method WebFontLoader.load does not have an implementation");
    }
  };
  return WebFontLoader;
})();
var loader = new WebFontLoader();

// Line spacing names and their values.
var LINE_SPACING_DEFAULT = "normal";
var LINE_SPACING_100 = "125%";
var LINE_SPACING_115 = "138%";
var LINE_SPACING_150 = "165%";
var LINE_SPACING_200 = "232%";
var NUMBER_VALUE_PATTERN = /^\d+(.\d+)?$/;
// Normalize the css line-height vlaue to percentage-based value if applicable.
// Also, it calibrates the incorrect line spacing value exported from Google
// Doc.
function toCSSLineSpacing(source) {
  if (!source) {
    return "";
  }
  var strValue = String(source);
  // e.g. line-height: 1.5;
  if (NUMBER_VALUE_PATTERN.test(strValue)) {
    var numValue = parseFloat(strValue);
    strValue = String(Math.round(numValue * 100)) + "%";
  }
  // Google Doc exports line spacing with wrong values. For instance:
  // - Single => 100%
  // - 1.15 => 115%
  // - Double => 200%
  // But the actual CSS value measured in Google Doc is like this:
  // - Single => 125%
  // - 1.15 => 138%
  // - Double => 232%
  // The following `if` block will calibrate the value if applicable.
  if (strValue === "normal") {
    return LINE_SPACING_DEFAULT;
  }
  if (strValue === "100%") {
    return LINE_SPACING_100;
  }
  if (strValue === "115%") {
    return LINE_SPACING_115;
  }
  if (strValue === "150%") {
    return LINE_SPACING_150;
  }
  if (strValue === "200%") {
    return LINE_SPACING_200;
  }
  // e.g. line-height: 15px;
  return strValue;
}

var mmTopxConverter = function (mm) {
  return mm * 3.7795275591;
};
function isNull(value) {
  return !!(value === null);
}
function isUndefined(value) {
  return !!(value === undefined);
}
function isNullOrUndefined(value) {
  return isNull(value) || isUndefined(value);
}

var splitPage = function (tr, pos, depth, typesAfter, schema) {
  if (depth === void 0) {
    depth = 1;
  }
  var paragraph = schema.nodes[PARAGRAPH].create();
  var end = schema.nodes[END].create();
  var start = schema.nodes[START].create();
  var emptyParBeforeTable = false;
  var header = sessionStorage.getItem("header")
    ? Node.fromJSON(schema, JSON.parse(sessionStorage.getItem("header")))
    : schema.nodes[HEADER].createAndFill(Fragment.from(paragraph));
  var footer = sessionStorage.getItem("footer")
    ? Node.fromJSON(schema, JSON.parse(sessionStorage.getItem("footer")))
    : schema.nodes[FOOTER].createAndFill(Fragment.from(paragraph));
  var counter = schema.nodes[PAGE_COUNTER].create();
  if (
    tr.doc.resolve(pos).node(3) &&
    tr.doc.resolve(pos).node(3).type === schema.nodes[TABLE] &&
    depth === 3
  ) {
    //
    // Handle split before TABLE
    //
    pos -= 1;
    depth = 4;
    emptyParBeforeTable = true;
  }
  var $pos = tr.doc.resolve(pos),
    before = Fragment.empty,
    after = Fragment.empty;
  for (
    var d = $pos.depth, e = $pos.depth - depth, i = depth - 1;
    d > e;
    d--, i--
  ) {
    before = Fragment.from(
      $pos.node(d).type.name === BODY
        ? [$pos.node(d).copy(before), footer, end, counter]
        : $pos.node(d).copy(before)
    );
    var typeAfterN = void 0;
    if (!isNullOrUndefined(typesAfter) && typesAfter[i]) {
      typeAfterN = typesAfter[i];
    } else {
      typeAfterN = typesAfter && typesAfter[i] && $pos.node(d);
    }
    after = Fragment.from(
      typeAfterN
        ? typeAfterN.type.createAndFill(typeAfterN.attrs, after)
        : $pos.node(d).type.name === BODY
        ? [start, header, $pos.node(d).copy(after)]
        : $pos.node(d).copy(after)
    );
  }
  tr = tr.step(
    new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth))
  );
  if (emptyParBeforeTable && depth === 3) {
    //
    // Remove empty before TABLE
    //
    var mappedPos = tr.mapping.map(pos);
    tr = tr.deleteRange(mappedPos, mappedPos);
  }
  return tr.scrollIntoView();
};
// const findCutBefore = $pos => {
//   if (!$pos.parent.type.spec.isolating)
//     for (let i = $pos.depth - 1; i >= 0; i--) {
//       if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1))
//       if ($pos.node(i).type.spec.isolating) break
//     }
//   return null
// }

// import { isNullOrUndefined } from '../utils/utils'
// import { ptToPx } from '../utils/toCSSPTValue'
var PARAGRAPH_DEPTH = 3;
var TABLE_DEPTH = 6;
// type ParagraphContent = { size: number; fontSizePt: number; textContent: string }
var key = new PluginKey("pagingPlugin");
var paginationPlugin = function () {
  return new Plugin({
    key: key,
    state: {
      init: function () {
        return {
          bodyHeight: null,
          bodyWidth: null,
          bodyBoundaries: null,
          posAtBodyEnd: null,
          cellInOffset: null,
          pasting: false,
          deleting: false,
          pagesMeta: [],
        };
      },
      apply: function (tr, prev) {
        var bodyDimenssion = tr.getMeta("splitPage");
        var bodyBoundaries = tr.getMeta("bodyBoundaries");
        var posAtBodyEnd = tr.getMeta("posAtBodyEnd");
        var cellInOffset = tr.getMeta("cellInOffset");
        var pasting = tr.getMeta("paste");
        var deleting = tr.getMeta("deleting");
        var pagesMeta = tr.getMeta("pagesMeta");
        var next = __assign({}, prev);
        if (bodyDimenssion) {
          next.bodyHeight = bodyDimenssion.bodyHeight;
          next.bodyWidth = bodyDimenssion.bodyWidth;
        }
        if (bodyBoundaries) next.bodyBoundaries = bodyBoundaries;
        if (posAtBodyEnd) next.posAtBodyEnd = posAtBodyEnd;
        if (pagesMeta) next.pagesMeta = pagesMeta;
        if (!posAtBodyEnd || !bodyDimenssion || !bodyBoundaries)
          next = __assign(__assign({}, next), {
            bodyHeight: null,
            bodyWidth: null,
            bodyBoundaries: null,
            posAtBodyEnd: null,
          });
        if (cellInOffset) next.cellInOffset = cellInOffset;
        if (pasting) next.pasting = pasting;
        next.deleting = deleting ? deleting : false;
        return next;
      },
    },
    view: function () {
      return {
        update: function (view, prevState) {
          var _a = view.state,
            selection = _a.selection,
            schema = _a.schema,
            tr = _a.tr;
          if (view.state.doc.eq(prevState.doc)) return;
          var domAtPos = view.domAtPos.bind(view);
          var pageDOM = findParentDomRefOfType(
            schema.nodes[PAGE],
            domAtPos
          )(selection);
          var pageBody = pageDOM.querySelector(".page-body");
          var deleting = false;
          if (selection.$anchor.node(2) && prevState.selection.$anchor.node(2))
            deleting = tr.doc.nodeSize < prevState.doc.nodeSize;
          var inserting = isOverflown(pageBody);
          if (inserting || deleting) {
            var bodyBoundaries = pageBody.getBoundingClientRect();
            var posAtBodyEnd = view.posAtCoords({
              left: bodyBoundaries.left,
              top: bodyBoundaries.bottom,
            });
            var pagesMeta_1 = [];
            tr.doc.forEach(function (node) {
              pagesMeta_1.push(node.attrs);
            });
            if (deleting) tr.setMeta("deleting", true);
            view.dispatch(
              tr
                .setMeta("splitPage", {
                  bodyHeight: pageBody.clientHeight,
                  bodyWidth: pageBody.clientWidth,
                })
                .setMeta("bodyBoundaries", bodyBoundaries)
                .setMeta("posAtBodyEnd", posAtBodyEnd)
                .setMeta("pagesMeta", pagesMeta_1)
            );
          }
        },
      };
    },
    appendTransaction: function (_a, _prevState, state) {
      var newTr = _a[0];
      var schema = state.schema,
        tr = state.tr;
      var _b = this.getState(state),
        bodyHeight = _b.bodyHeight,
        pasting = _b.pasting,
        deleting = _b.deleting;
      var splitCommand = newTr.getMeta("splitCommand");
      // const isPointer = newTr.getMeta('pointer')
      var prevSelectionPos;
      if (!bodyHeight || splitCommand) return;
      if (
        state.selection.$head.node(1) === state.doc.lastChild &&
        state.selection.$head.node(2).lastChild ===
          state.selection.$head.node(3) &&
        !pasting &&
        !deleting
        // state.selection.$head.node(3).type !== schema.nodes[TABLE]
      ) {
        //
        // If carret is on the last element of the page directlty split page skil else
        //
        if (tr.selection.$head.parentOffset === 0) {
          tr = tr.step(
            new ReplaceStep(
              tr.selection.head - 2,
              tr.selection.head,
              Slice.empty
            )
          );
          return splitPage(
            tr,
            tr.selection.head,
            tr.selection.$head.depth,
            null,
            schema
          );
        }
        return splitPage(
          tr,
          tr.selection.head - 1,
          tr.selection.$head.depth,
          null,
          schema
        ).scrollIntoView();
      }
      prevSelectionPos = state.selection.head;
      tr = removeHeadersAndFooters(tr, schema);
      tr = joinDocument(tr);
      tr = addHeadersAndFooters(tr, schema);
      tr = splitDocument(tr, state);
      tr = skipFooterHeaderInSelection(tr, schema, prevSelectionPos, deleting);
      return tr.scrollIntoView();
    },
  });
};
function skipFooterHeaderInSelection(tr, schema, prevSelectionPos, deleting) {
  //
  // This prevents skiping the last selection on page before split
  //
  var newTr = setTextSelection(prevSelectionPos)(tr);
  if (newTr.selection.$head.node(2).type !== schema.nodes[BODY] && !deleting) {
    return skipFooterHeaderInSelection(
      newTr,
      schema,
      prevSelectionPos + 1,
      deleting
    );
  }
  if (newTr.selection.$head.node(2).type !== schema.nodes[BODY] && deleting) {
    return skipFooterHeaderInSelection(
      newTr,
      schema,
      prevSelectionPos - 1,
      deleting
    );
  }
  return newTr;
}
function removeHeadersAndFooters(tr, schema) {
  tr.doc.descendants(function (node, pos) {
    var mappedPos = tr.mapping.map(pos);
    if (node.type === schema.nodes[FOOTER]) {
      tr = tr.step(
        new ReplaceStep(mappedPos, mappedPos + node.nodeSize, Slice.empty)
      );
      return false;
    }
    if (node.type === schema.nodes[HEADER]) {
      tr = tr.step(
        new ReplaceStep(mappedPos, mappedPos + node.nodeSize, Slice.empty)
      );
      return false;
    }
    if (node.type === schema.nodes[PAGE_COUNTER]) {
      tr = tr.step(
        new ReplaceStep(mappedPos, mappedPos + node.nodeSize, Slice.empty)
      );
      return false;
    }
    if (node.type === schema.nodes[END]) {
      tr = tr.step(
        new ReplaceStep(mappedPos, mappedPos + node.nodeSize, Slice.empty)
      );
      return false;
    }
    if (node.type === schema.nodes[START]) {
      tr = tr.step(
        new ReplaceStep(mappedPos, mappedPos + node.nodeSize, Slice.empty)
      );
      return false;
    }
    if (node.type === schema.nodes[BODY]) {
      return false;
    }
  });
  return tr;
}
function joinDocument(tr) {
  while (tr.doc.content.childCount > 1) {
    tr.join(tr.doc.content.firstChild.nodeSize, 2);
  }
  return tr;
}
function addHeadersAndFooters(tr, schema) {
  var cachedHeader = JSON.parse(sessionStorage.getItem("header"));
  var cachedFooter = JSON.parse(sessionStorage.getItem("footer"));
  var header = cachedHeader
    ? Node.fromJSON(schema, cachedHeader)
    : schema.nodes[HEADER].createAndFill({}, null);
  var footer = cachedFooter
    ? Node.fromJSON(schema, cachedFooter)
    : schema.nodes[FOOTER].createAndFill({}, null);
  var end = schema.nodes[END].create();
  var start = schema.nodes[START].create();
  var counter = schema.nodes[PAGE_COUNTER].create();
  tr = tr.insert(
    tr.doc.firstChild.content.firstChild.nodeSize + 1,
    Fragment.from([footer, end, counter])
  );
  tr = tr.insert(1, Fragment.from([start, header]));
  return tr;
}
function splitDocument(tr, state) {
  var schema = state.schema;
  var pagesMeta = key.getState(state).pagesMeta;
  var splitInfo = getNodeHeight(tr.doc, state);
  var nextPageModel = state.schema.nodes[PAGE].create(
    pagesMeta[tr.doc.childCount]
  );
  if (!splitInfo) return tr;
  var newTr = splitPage(
    tr,
    splitInfo.pos - 1,
    splitInfo.depth,
    [nextPageModel],
    state.schema
  );
  if (splitInfo.depth !== 6) newTr = removePararaphAtStart(newTr, schema);
  if (splitInfo.depth === 3 && splitInfo.cellStart !== null) {
    newTr = joinTables(newTr, splitInfo, schema);
  }
  if (splitInfo.depth === 6) {
    newTr = removeLastRowFromSplit(tr, schema, splitInfo);
    newTr = joinTables(newTr, splitInfo, schema);
  }
  if (getNodeHeight(newTr.doc, state)) {
    return splitDocument(newTr, state);
  }
  return newTr;
}
function getNodeHeight(doc, state) {
  //
  // This function measurs rest of the node and returns postiotns and depth wheret to split
  //
  var schema = state.schema;
  var lastChild = doc.lastChild;
  var _a = key.getState(state),
    bodyHeight = _a.bodyHeight,
    deleting = _a.deleting;
  var accumolatedHeight = 2;
  var pageBoundary = null;
  doc.descendants(function (node, pos) {
    if (accumolatedHeight > bodyHeight) {
      return false;
    }
    if (node.type === schema.nodes[PAGE] && node !== lastChild) {
      return false;
    }
    if (node.type === schema.nodes[HEADER]) return false;
    if (node.type === schema.nodes[FOOTER]) return false;
    if (node.type === schema.nodes[PAGE_COUNTER]) return false;
    if (node.type === schema.nodes[PARAGRAPH]) {
      var pHeight = getParagraphHeight(node);
      accumolatedHeight += pHeight;
      if (accumolatedHeight > bodyHeight) {
        pageBoundary = {
          pos: pos,
          height: accumolatedHeight,
          depth: PARAGRAPH_DEPTH,
          offsetInCell: null,
          cellStart: null,
        };
        return false;
      }
    }
    if (node.type === schema.nodes[TABLE]) {
      var tableMap_1 = TableMap.get(node);
      var highestAtIndex = findHighestColumn(tableMap_1, node, pos);
      var cellsInColumn = getCellsInColumn(
        highestAtIndex.index,
        node,
        tableMap_1,
        pos
      );
      var _loop_1 = function (i) {
        //
        // loops all cells in column
        //
        if (accumolatedHeight > bodyHeight) return "break";
        //
        // Adds cell paddings
        //
        accumolatedHeight += 7;
        var _a = cellsInColumn[i],
          start = _a.start,
          cellNode = _a.node;
        cellNode.forEach(function (innerNode, offset) {
          //
          // loops into cells content
          //
          if (accumolatedHeight > bodyHeight) return;
          if (innerNode.type === schema.nodes[PARAGRAPH]) {
            var pHeight = getParagraphHeight(innerNode);
            accumolatedHeight += pHeight;
            if (accumolatedHeight > bodyHeight) {
              //
              // if only one row is left spliting is done right before the table not before the tr
              //
              //TODO: Fix this logic
              var isFirstRow =
                doc.resolve(start).node(3).lastChild ===
                  doc.resolve(start).parent && tableMap_1.height > 1;
              pageBoundary = {
                pos:
                  isFirstRow && !deleting
                    ? start - doc.resolve(start).parentOffset - 3
                    : doc.resolve(start).before(3),
                height: accumolatedHeight,
                depth: isFirstRow && !deleting ? TABLE_DEPTH : PARAGRAPH_DEPTH,
                offsetInCell: offset,
                cellStart: start,
              };
            }
          }
        });
      };
      for (var i = 0; i < cellsInColumn.length; i++) {
        var state_1 = _loop_1(i);
        if (state_1 === "break") break;
      }
      return false;
    }
  });
  return pageBoundary ? pageBoundary : null;
}
function removeLastRowFromSplit(tr, _schema, splitInfo) {
  var doc = tr.doc;
  var mappedPos = tr.mapping.map(splitInfo.pos);
  var resolvedPos = doc.resolve(mappedPos);
  var rowPos = resolvedPos.before(4);
  tr = tr.step(
    new ReplaceStep(rowPos, rowPos + doc.nodeAt(rowPos).nodeSize, Slice.empty)
  );
  return tr;
}
// function removeParagraphAtTable(tr: Transaction, _schema: Schema, splitInfo: SplitInfo): Transaction {
//   const { doc } = tr
//   // const mappedPos = tr.mapping.map(splitInfo.pos)
//   // const emptyParagraph = doc.resolve(mappedPos - 1).node(6)
//   // tr = tr.delete(mappedPos - 1, mappedPos - 1 + emptyParagraph.nodeSize)
//   const tableResolvedPos = doc.resolve(splitInfo.pos - 3)
//   const tableMap = TableMap.get(doc.nodeAt(tableResolvedPos.before(3)))
//   if (tableMap.height === 1) {
//     const tablePos = tableResolvedPos.before(3)
//     tr = tr.step(new ReplaceStep(tablePos, tablePos + doc.nodeAt(tablePos).nodeSize, Slice.empty))
//   } else {
//     const tableRowPos = doc.resolve(splitInfo.pos - 3).before(4)
//     tr = tr.step(new ReplaceStep(tableRowPos, tableRowPos + doc.nodeAt(tableRowPos).nodeSize, Slice.empty))
//   }
//   return tr
// }
function joinTables(tr, splitInfo, schema, _state) {
  //
  // when splitInfo.depth === 3 we are spliting the first remaining row so its done before the whole table
  //
  var doc = tr.doc;
  var mappedPos =
    splitInfo.depth === 3
      ? tr.mapping.map(splitInfo.cellStart - 3)
      : tr.mapping.map(splitInfo.pos);
  var resolvedPos = doc.resolve(mappedPos);
  var isTable =
    splitInfo.depth === 3 ? doc.nodeAt(mappedPos) : resolvedPos.node(3);
  var isNextTable =
    splitInfo.depth === 3
      ? doc.nodeAt(doc.resolve(mappedPos + 1).after(3))
      : doc.nodeAt(resolvedPos.after(3));
  if (!isNextTable || !isTable) return tr;
  if (
    isNextTable.type === schema.nodes[TABLE] &&
    isTable.type === schema.nodes[TABLE] &&
    splitInfo.depth !== 3
  ) {
    tr = tr.step(
      new ReplaceStep(
        resolvedPos.after(3) - 1,
        resolvedPos.after(3) + 1,
        Slice.empty
      )
    );
  }
  if (
    isNextTable.type === schema.nodes[TABLE] &&
    isTable.type === schema.nodes[TABLE] &&
    splitInfo.depth === 3
  ) {
    tr = tr.step(
      new ReplaceStep(
        doc.resolve(mappedPos + 1).after(3) - 1,
        doc.resolve(mappedPos + 1).after(3) + 1,
        Slice.empty
      )
    );
  }
  return tr;
}
function removePararaphAtStart(tr, schema) {
  //
  // Removes fist paragraph inserted by split
  //
  var lastChild = tr.doc.lastChild;
  tr.doc.descendants(function (node, pos) {
    if (node.type === schema.nodes[PAGE] && node !== lastChild) {
      return false;
    }
    if (node.type === schema.nodes[BODY]) {
      var firstParagraph = tr.doc.nodeAt(pos + 1);
      tr = tr.delete(pos + 1, pos + 1 + firstParagraph.nodeSize);
      return false;
    }
  });
  return tr;
}
function getParagraphHeight(node) {
  var parsedPoints = 15;
  var paragraphDOM = document.getElementById(node.attrs.id);
  if (paragraphDOM) return paragraphDOM.getBoundingClientRect().height;
  return parsedPoints + node.attrs.paddingTop + node.attrs.paddingBottom;
  // let parsedPoints: number = 15
  // const parentWidth = tableMap ? bodyWidth / tableMap.width - 10 : bodyWidth
  // let bufferWidth = 0
  // let row: number = 0
  // const content = getFontMarks(node, schema.marks[MARK_FONT_SIZE])
  // const paragraphStructure: Array<Array<ParagraphContent>> = []
  // if (isNullOrUndefined(content)) {
  //   return parsedPoints + node.attrs.paddingTop + node.attrs.paddingBottom
  // }
  // if (content.length === 1 && content[0].textContent.length > 0) {
  //   //
  //   //  Measures multiline paragraph heigt when is with the same font size
  //   //
  //   const textWidth = getTextWidth(content[0].textContent, `${content[0].fontSizePt}pt arial`)
  //   const rows: number = Math.ceil(textWidth / parentWidth)
  //   const parsedPoints = ptToPx(content[0].fontSizePt)
  //   const heightToUse = parsedPoints > 15 ? parsedPoints : 15
  //   return rows * heightToUse + node.attrs.paddingBottom + node.attrs.paddingTop
  // }
  // //
  // //  Measuser multiline paragraph heigt when is with the same font size
  // //
  // for (let i = 0; content.length > i; i++) {
  //   const textWidth = getTextWidth(content[i].textContent, `${content[i].fontSizePt}pt arial`)
  //   bufferWidth += textWidth
  //   while (bufferWidth > parentWidth) {
  //     isNullOrUndefined(paragraphStructure[row])
  //       ? paragraphStructure.push([content[i]])
  //       : paragraphStructure[row].push(content[i])
  //     bufferWidth = bufferWidth - parentWidth
  //     row++
  //   }
  //   isNullOrUndefined(paragraphStructure[row])
  //     ? paragraphStructure.push([content[i]])
  //     : paragraphStructure[row].push(content[i])
  // }
  // const max = (a, b) => Math.max(a, b)
  // const prop = p => o => o[p]
  // const getFontSize = prop('fontSizePt')
  // const mapped = paragraphStructure.map(row => row.map(getFontSize).reduce(max, 0))
  // return (
  //   mapped.reduce((fontPt: number, acc: number) => ptToPx(fontPt) + acc, 0) +
  //   node.attrs.paddingBottom +
  //   node.attrs.paddingTop
  // )
}
// function getFontMarks(node: Node, markType: MarkType): ParagraphContent[] {
//   if (!node.firstChild) return null
//   let content: ParagraphContent[] = []
//   node.forEach((child: Node) => {
//     const [fontSizeMark] = child.marks.filter((m: Mark) => m.type === markType)
//     content.push({
//       size: child.nodeSize,
//       fontSizePt: fontSizeMark ? fontSizeMark.attrs.pt : 11.25,
//       textContent: child.textContent,
//     })
//   })
//   return content
// }
// function getTextWidth(text: string, font: string) {
//   const canvas = document.createElement('canvas')
//   const context = canvas.getContext('2d')
//   context.font = font
//   const metrics = context.measureText(text)
//   return metrics.width
// }
function getCellsInColumn(columnIndex, table, tableMap, tablePos) {
  var indexes = Array.isArray(columnIndex)
    ? columnIndex
    : Array.from([columnIndex]);
  var cells = indexes.reduce(function (acc, index) {
    if (index >= 0 && index <= tableMap.width - 1) {
      var cells_1 = tableMap.cellsInRect({
        left: index,
        right: index + 1,
        top: 0,
        bottom: tableMap.height,
      });
      return acc.concat(
        cells_1.map(function (nodePos) {
          var node = table.nodeAt(nodePos);
          var pos = nodePos + tablePos;
          return { pos: pos, start: pos + 1, node: node };
        })
      );
    }
  }, []);
  return cells;
}
function findHighestColumn(tableMap, node, pos) {
  // { size: child ccount of the cell, index: at row index }
  var currHighestAt = {
    size: 0,
    index: 0,
  };
  var _loop_2 = function (i) {
    var currColumn = getCellsInColumn(i, node, tableMap, pos);
    var columnHeight = 0;
    for (
      var _i = 0, currColumn_1 = currColumn;
      _i < currColumn_1.length;
      _i++
    ) {
      var cell = currColumn_1[_i];
      cell.node.descendants(function (node) {
        if (node.type.name === PARAGRAPH) {
          columnHeight += getParagraphHeight(node);
        }
      });
      columnHeight += 8;
    }
    if (currHighestAt.size < columnHeight) {
      currHighestAt = { size: columnHeight, index: i };
    }
  };
  for (var i = 0; i < tableMap.width; i++) {
    _loop_2(i);
  }
  return currHighestAt;
}
var isOverflown = function (_a) {
  var clientWidth = _a.clientWidth,
    clientHeight = _a.clientHeight,
    scrollWidth = _a.scrollWidth,
    scrollHeight = _a.scrollHeight;
  return scrollHeight > clientHeight || scrollWidth > clientWidth;
};

var MARK_CODE = "code";
var MARK_EM = "em";
var MARK_FONT_SIZE = "mark-font-size";
var MARK_FONT_FAMILY = "font-family";
var MARK_LINK = "link";
var MARK_NO_BREAK = "mark-no-break";
var MARK_STRIKE = "strike";
var MARK_STRONG = "strong";
var MARK_SUPER = "super";
var MARK_TEXT_COLOR = "mark-text-color";
var MARK_TEXT_HIGHLIGHT = "mark-text-highlight";
var MARK_TEXT_SELECTION = "mark-text-selection";
var MARK_UNDERLINE = "underline";
var MARK_SPACER = "spacer";
var MARK_BACKGROUND_COLOR = "mark-background-color";

var INDENT_MARGIN_SIZE = 20;
var MIN_INDENT_LEVEL = 0;
var EMPTY_CSS_VALUE = new Set(["", "0%", "0pt", "0px", 0]);
var ALIGN_PATTERN = /(left|right|center|justify)/;
var getAttrs = function (dom) {
  var _a = dom.style,
    lineHeight = _a.lineHeight,
    textAlign = _a.textAlign,
    direction = _a.direction;
  var align = dom.getAttribute("align") || textAlign || "";
  align = ALIGN_PATTERN.test(align) ? align : null;
  var lineSpacing = lineHeight ? toCSSLineSpacing(lineHeight) : null;
  var id = dom.getAttribute("id") || "";
  var paddingTop = dom.style.paddingTop.replace(/[A-Za-z$-()]/g, "").split(",");
  var paddingBottom = dom.style.paddingBottom
    .replace(/[A-Za-z$-()]/g, "")
    .split(",");
  return {
    align: align,
    lineSpacing: lineSpacing,
    paddingTop: paddingTop,
    paddingBottom: paddingBottom,
    id: id,
    direction: direction,
  };
};
var toDOM = function (node) {
  var _a = node.attrs,
    align = _a.align,
    lineSpacing = _a.lineSpacing,
    paddingTop = _a.paddingTop,
    paddingBottom = _a.paddingBottom,
    id = _a.id,
    spellcheck = _a.spellcheck,
    indentLeft = _a.indentLeft,
    indentRight = _a.indentRight,
    direction = _a.direction;
  var attrs = {};
  var style = "";
  if (align) {
    style += "text-align: " + align + ";";
  }
  // attr line-spacing
  if (lineSpacing) {
    var cssLineSpacing = toCSSLineSpacing(lineSpacing);
    style += "line-height: " + cssLineSpacing + ";";
  }
  if (paddingTop && !EMPTY_CSS_VALUE.has(paddingTop)) {
    style += "padding-top: " + paddingTop + "px;";
  }
  if (paddingBottom && !EMPTY_CSS_VALUE.has(paddingBottom)) {
    style += "padding-bottom: " + paddingBottom + "px;";
  }
  if (indentLeft) {
    style += "margin-left: " + mmTopxConverter(indentLeft) + "px;";
  }
  if (indentRight) {
    style += "padding-right: " + mmTopxConverter(indentRight) + "px;";
  }
  if (id) {
    attrs.id = id;
  } else {
    attrs.id = node.type.name + "_" + Math.random().toString(36).substr(2, 9);
  }
  if (direction) {
    style += "direction:" + direction + ";";
  }
  attrs.spellcheck = spellcheck;
  style && (attrs.style = style);
  return ["p", attrs, 0];
};
var ParagraphNodeSpec = {
  attrs: {
    align: { default: null },
    color: { default: null },
    direction: { default: null },
    id: { default: null },
    // in mmm
    indentLeft: { default: 0 },
    indentRight: { default: 0 },
    lineSpacing: { default: null },
    spellcheck: { default: true },
    //in px
    paddingBottom: { default: 5 },
    paddingTop: { default: 5 },
  },
  content: "inline*",
  group: "block",
  parseDOM: [
    {
      tag: "p",
      getAttrs: getAttrs,
    },
  ],
  toDOM: toDOM,
};
var toParagraphDOM = toDOM;
var getParagraphNodeAttrs = getAttrs;

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
var BlockquoteNodeSpec = __assign(__assign({}, ParagraphNodeSpec), {
  defining: true,
  parseDOM: [{ tag: "blockquote", getAttrs: getAttrs$1 }],
  toDOM: toDOM$1,
});
function toDOM$1(node) {
  var dom = toParagraphDOM(node);
  dom[0] = "blockquote";
  return dom;
}
function getAttrs$1(dom) {
  return getParagraphNodeAttrs(dom);
}

var ATTRIBUTE_LIST_STYLE_TYPE = "data-list-style-type";
var ALIGN_PATTERN$1 = /(left|right|center|justify)/;
function getAttrs$2(dom) {
  var attrs = {};
  var textAlign = dom.style.textAlign;
  var align = dom.getAttribute("data-align") || textAlign || "";
  var font = dom.getAttribute("data-font");
  var fontFamily = dom.getAttribute("data-font-family");
  align = ALIGN_PATTERN$1.test(align) ? align : null;
  if (align) {
    attrs.align = align;
  }
  if (font) attrs.font = Number(font);
  if (fontFamily) attrs.fontFamily = fontFamily;
  return attrs;
}
var ListItemNodeSpec = {
  attrs: {
    align: { default: null },
    font: { default: null },
    fontFamily: { default: null },
  },
  // NOTE:
  // This spec does not support nested lists (e.g. `'paragraph block*'`)
  // as content because of the complexity of dealing with indentation
  // (context: https://github.com/ProseMirror/prosemirror/issues/92).
  content: "paragraph",
  parseDOM: [{ tag: "li", getAttrs: getAttrs$2 }],
  // NOTE:
  // This method only defines the minimum HTML attributes needed when the node
  // is serialized to HTML string. Usually this is called when user copies
  // the node to clipboard.
  // The actual DOM rendering logic is defined at `src/ui/ListItemNodeView.js`.
  toDOM: function (node) {
    var attrs = {};
    var _a = node.attrs,
      align = _a.align,
      font = _a.font,
      fontFamily = _a.fontFamily;
    if (align) {
      attrs["data-align"] = align;
    }
    if (font) {
      attrs["data-font"] = font;
      attrs.style = "--list-font:" + font + "pt";
    }
    if (fontFamily) {
      attrs["data-font-family"] = fontFamily;
    }
    return ["li", attrs, 0];
  },
};

// import { MIN_INDENT_LEVEL } from './paragraphNodeSpec'
var AUTO_LIST_STYLE_TYPES = ["disc", "square", "circle"];
var BulletListNodeSpec = {
  attrs: {
    id: { default: null },
    indent: { default: 0 },
    listStyleType: { default: null },
  },
  group: "block",
  content: LIST_ITEM + "+",
  parseDOM: [
    {
      tag: "ul",
      getAttrs: function (dom) {
        var listStyleType = dom.getAttribute(ATTRIBUTE_LIST_STYLE_TYPE) || null;
        return {
          listStyleType: listStyleType,
        };
      },
    },
  ],
  toDOM: function (node) {
    var _a = node.attrs,
      indent = _a.indent,
      listStyleType = _a.listStyleType;
    var attrs = {};
    if (listStyleType) {
      attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }
    var htmlListStyleType = listStyleType;
    if (!htmlListStyleType || htmlListStyleType === "disc") {
      htmlListStyleType =
        AUTO_LIST_STYLE_TYPES[indent % AUTO_LIST_STYLE_TYPES.length];
    }
    attrs.type = htmlListStyleType;
    return ["ul", attrs, 0];
  },
};

var PRE_DOM = ["pre", ["code", 0]];
// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A code listing. Disallows marks or non-text inline
// nodes by default. Represented as a `<pre>` element with a
// `<code>` element inside of it.
var CodeBlockNodeSpec = {
  attrs: {
    id: { default: null },
  },
  content: "inline*",
  group: "block",
  marks: "_",
  code: true,
  defining: true,
  parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
  toDOM: function () {
    return PRE_DOM;
  },
};

var DocNodeSpec = {
  attrs: {
    counterTop: { default: 10 },
    counterLeft: { default: 10 },
    counterContent: { default: "Page" },
    counterMode: { default: "full" },
    zoom: { default: 1 },
    direction: { default: "ltr" },
    layout: { default: "document" },
  },
  content: PAGE + "+",
};

var BR_DOM = ["br"];
var HardBreakNodeSpec = {
  inline: true,
  group: "inline",
  selectable: false,
  parseDOM: [{ tag: "br" }],
  toDOM: function () {
    return BR_DOM;
  },
};

var HEADING_LEVELS = {
  N: "Normal",
  H1: "Heading 1",
  H2: "Heading 2",
  H3: "Heading 3",
  H4: "Heading 4",
  H5: "Heading 5",
  H6: "Heading 6",
};
var HeadingNode = __assign(__assign({}, ParagraphNodeSpec), {
  attrs: __assign(__assign({}, ParagraphNodeSpec.attrs), {
    level: { default: "Normal" },
  }),
  defining: true,
  parseDOM: [
    { tag: "h1", getAttrs: getAttrs$3 },
    { tag: "h2", getAttrs: getAttrs$3 },
    { tag: "h3", getAttrs: getAttrs$3 },
    { tag: "h4", getAttrs: getAttrs$3 },
    { tag: "h5", getAttrs: getAttrs$3 },
    { tag: "h6", getAttrs: getAttrs$3 },
  ],
  toDOM: function (node) {
    var dom = toParagraphDOM(node);
    var level = node.attrs.level || HEADING_LEVELS["N"];
    // const { paddingBottom, paddingTop } = node.attrs
    if (level === HEADING_LEVELS["N"]) {
      dom[0] = "p";
    } else {
      dom[0] = typeof level === "string" ? level.toLowerCase() : "h" + level;
    }
    return dom;
  },
});
function getAttrs$3(dom) {
  var attrs = getParagraphNodeAttrs(dom);
  var level = dom.nodeName || "N";
  attrs.level = level;
  return attrs;
}

var DOM_ATTRIBUTE_PAGE_BREAK = "data-page-break";
function getAttrs$4(dom) {
  var attrs = {};
  if (
    dom.getAttribute(DOM_ATTRIBUTE_PAGE_BREAK) ||
    dom.style.pageBreakBefore === "always"
  ) {
    // Google Doc exports page break as HTML:
    // `<hr style="page-break-before:always;display:none; />`.
    attrs.pageBreak = true;
  }
  return attrs;
}
var HorizontalRuleNode = {
  attrs: {
    pageBreak: { default: null },
  },
  group: "block",
  parseDOM: [{ tag: "hr", getAttrs: getAttrs$4 }],
  toDOM: function (node) {
    var domAttrs = {};
    if (node.attrs.pageBreak) {
      domAttrs[DOM_ATTRIBUTE_PAGE_BREAK] = "true";
    }
    return ["hr", domAttrs];
  },
};

var CSS_ROTATE_PATTERN = /rotate\(([0-9\.]+)rad\)/i;
var EMPTY_CSS_VALUE$1 = new Set(["0%", "0pt", "0px"]);
// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
var ImageNode = {
  inline: true,
  attrs: {
    align: { default: "inline" },
    alt: { default: "" },
    imxID: { default: "" },
    crop: { default: null },
    rotate: { default: null },
    src: { default: null },
    title: { default: "" },
    // height: { default: 300 },
    width: { default: 250 },
    height: { default: 250 },
    name: { default: "editor-pic" },
  },
  group: "inline",
  draggable: true,
  selectable: true,
  parseDOM: [
    {
      tag: "img[src]",
      getAttrs: function (dom) {
        var _a = dom.style,
          cssFloat = _a.cssFloat,
          display = _a.display,
          marginTop = _a.marginTop,
          marginLeft = _a.marginLeft;
        var _b = dom.style,
          width = _b.width,
          height = _b.height;
        var align = dom.getAttribute("data-align") || dom.getAttribute("align");
        if (align) {
          align = /(left|right|center)/.test(align) ? align : null;
        } else if (cssFloat === "left" && !display) {
          align = "left";
        } else if (cssFloat === "right" && !display) {
          align = "right";
        } else if (!cssFloat && display === "block") {
          align = "block";
        }
        width = width || dom.getAttribute("width");
        height = height || dom.getAttribute("height");
        var crop = null;
        var rotate = null;
        var parentElement = dom.parentElement;
        if (parentElement instanceof HTMLElement) {
          // Special case for Google doc's image.
          var ps = parentElement.style;
          if (
            ps.display === "inline-block" &&
            ps.overflow === "hidden" &&
            ps.width &&
            ps.height &&
            marginLeft &&
            !EMPTY_CSS_VALUE$1.has(marginLeft) &&
            marginTop &&
            !EMPTY_CSS_VALUE$1.has(marginTop)
          ) {
            crop = {
              width: parseInt(ps.width, 10) || 0,
              height: parseInt(ps.height, 10) || 0,
              left: parseInt(marginLeft, 10) || 0,
              top: parseInt(marginTop, 10) || 0,
            };
          }
          if (ps.transform) {
            // example: `rotate(1.57rad) translateZ(0px)`;
            var mm = ps.transform.match(CSS_ROTATE_PATTERN);
            if (mm && mm[1]) {
              rotate = parseFloat(mm[1]) || null;
            }
          }
        }
        return {
          align: align,
          alt: dom.getAttribute("alt") || null,
          crop: crop,
          // height: parseInt(height, 10) || null,
          rotate: rotate,
          src: dom.getAttribute("src") || null,
          title: dom.getAttribute("title") || null,
          width: parseInt(width, 10) || null,
          height: parseInt(height, 10) || null,
          name: dom.dataset.name || dom.name || "editor-pic",
        };
      },
    },
  ],
  toDOM: function (node) {
    var _a;
    var _b = node.attrs,
      src = _b.src,
      width = _b.width,
      height = _b.height,
      name = _b.name;
    if (name)
      return [
        "img",
        ((_a = { src: src, width: width, height: height }),
        (_a["data-name"] = name),
        _a),
      ];
  },
};

var ATTRIBUTE_COUNTER_RESET = "data-counter-reset";
var ATTRIBUTE_FOLLOWING = "data-following";
var AUTO_LIST_STYLE_TYPES$1 = ["decimal", "lower-alpha", "lower-roman"];
var OrderedListNodeSpec = {
  attrs: {
    id: { default: null },
    counterReset: { default: null },
    indent: { default: MIN_INDENT_LEVEL },
    following: { default: null },
    listStyleType: { default: null },
    name: { default: null },
    start: { default: 1 },
  },
  group: "block",
  content: LIST_ITEM + "+",
  parseDOM: [
    {
      tag: "ol",
      getAttrs: function (dom) {
        var listStyleType = dom.getAttribute(ATTRIBUTE_LIST_STYLE_TYPE);
        var counterReset =
          dom.getAttribute(ATTRIBUTE_COUNTER_RESET) || undefined;
        var start = dom.hasAttribute("start")
          ? parseInt(dom.getAttribute("start"), 10)
          : 1;
        var name = dom.getAttribute("name") || undefined;
        var following = dom.getAttribute(ATTRIBUTE_FOLLOWING) || undefined;
        return {
          counterReset: counterReset,
          following: following,
          listStyleType: listStyleType,
          name: name,
          start: start,
        };
      },
    },
  ],
  toDOM: function (node) {
    var _a = node.attrs,
      start = _a.start,
      indent = _a.indent,
      listStyleType = _a.listStyleType,
      counterReset = _a.counterReset,
      following = _a.following,
      name = _a.name;
    var attrs = {};
    if (counterReset === "none") {
      attrs[ATTRIBUTE_COUNTER_RESET] = counterReset;
    }
    if (following) {
      attrs[ATTRIBUTE_FOLLOWING] = following;
    }
    if (listStyleType) {
      attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }
    if (start !== 1) {
      attrs.start = start;
    }
    if (name) {
      attrs.name = name;
    }
    var htmlListStyleType = listStyleType;
    if (!htmlListStyleType || htmlListStyleType === "decimal") {
      htmlListStyleType =
        AUTO_LIST_STYLE_TYPES$1[indent % AUTO_LIST_STYLE_TYPES$1.length];
    }
    var cssCounterName = "czi-counter-" + indent;
    attrs.style =
      "--stylus-counter-name: " +
      cssCounterName +
      ";" +
      ("--stylus-counter-reset: " + (following ? "none" : start - 1) + ";") +
      ("--stylus-list-style-type: " + htmlListStyleType) +
      ("margin-left: " + indent * INDENT_MARGIN_SIZE + "px");
    attrs.type = htmlListStyleType;
    return ["ol", attrs, 0];
  },
};

var NO_VISIBLE_BORDER_WIDTH = new Set(["0pt", "0px"]);
var TableNodesSpecs = tableNodes({
  tableGroup: "block",
  cellContent: "block+",
  cellAttributes: {
    borderColor: {
      default: null,
      getFromDOM: function (dom) {
        var _a = dom.style,
          borderColor = _a.borderColor,
          borderWidth = _a.borderWidth;
        if (NO_VISIBLE_BORDER_WIDTH.has(borderWidth)) {
          return "transparent";
        }
        return (borderColor && toCSSColor(borderColor)) || null;
      },
      setDOMAttr: function (value, attrs) {
        if (value) {
          attrs.style = (attrs.style || "") + ("border-color: " + value + ";");
        }
      },
    },
    background: {
      default: null,
      // TODO: Move these to a table helper.
      getFromDOM: function (dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr: function (value, attrs) {
        if (value) {
          attrs.style =
            (attrs.style || "") + ("background-color: " + value + ";");
        }
        // if (attrs['data-colwidth']) {
        // 	att
        // }
      },
    },
    align: {
      default: null,
      // TODO: Move these to a table helper.
      getFromDOM: function (dom) {
        return dom.align || null;
      },
      setDOMAttr: function (value, attrs) {
        if (value) {
          attrs.align = (attrs.align || "") + value;
        }
        // if (attrs['data-colwidth']) {
        // 	att
        // }
      },
    },
    valign: {
      default: null,
      // TODO: Move these to a table helper.
      getFromDOM: function (dom) {
        return dom.vAlign || null;
      },
      setDOMAttr: function (value, attrs) {
        if (value) {
          attrs.vAlign = (attrs.vAlign || "") + value;
        }
        // if (attrs['data-colwidth']) {
        // 	att
        // }
      },
    },
    class: {
      default: "",
      // TODO: Move these to a table helper.
      getFromDOM: function (dom) {
        return (dom.className = "");
      },
      setDOMAttr: function (value, attrs) {
        if (value) {
          attrs.class = value;
        }
      },
    },
    borderWidth: {
      default: 1,
      // TODO: Move these to a table helper.
      getFromDOM: function (dom) {
        var borderWidth = dom.style.borderWidth;
        var bwidth = Number(borderWidth.replace(/[A-Za-z$-()]/g, ""));
        return bwidth;
      },
      setDOMAttr: function (value, attrs) {
        if (value) {
          attrs.style =
            (attrs.style || "") + ("border-width: " + value + "px;");
        }
      },
    },
  },
});
// Override the default table node spec to support custom attributes.
var TableNodeSpec = Object.assign({}, TableNodesSpecs.table, {
  attrs: {
    marginLeft: { default: null },
  },
  parseDOM: [
    {
      tag: "table",
      getAttrs: function (dom) {
        var marginLeft = dom.style.marginLeft;
        if (marginLeft && /\d+px/.test(marginLeft)) {
          return { marginLeft: parseFloat(marginLeft) };
        }
        return undefined;
      },
    },
  ],
  toDOM: function (node) {
    // Normally, the DOM structure of the table node is rendered by
    // `TableNodeView`. This method is only called when user selects a
    // table node and copies it, which triggers the "serialize to HTML" flow
    //  that calles this method.
    var marginLeft = node.attrs.marginLeft;
    var domAttrs = {};
    if (marginLeft) {
      domAttrs.style = "margin-left: " + marginLeft + "px";
    }
    return ["table", domAttrs, 0];
  },
});
Object.assign(TableNodesSpecs, { table: TableNodeSpec });

var TextNodeSpec = {
  group: "inline",
};

var PageDragNodeSpec = {
  attrs: {
    class: { default: "editor-page" },
    height: { default: 298 },
    width: { default: 211 },
    margin: { default: "auto" },
    background: { default: "#ffffff" },
    orientation: { default: "portrait" },
    indentLeft: { default: 20 },
    indentRight: { default: 20 },
    indentTop: { default: 10 },
    indentBottom: { default: 10 },
    direction: { default: "ltr" },
    rectoVerso: { default: false },
  },
  content:
    START +
    "? " +
    HEADER +
    "? " +
    BODY +
    " " +
    FOOTER +
    "? " +
    END +
    "? " +
    PAGE_COUNTER +
    "?",
  parseDOM: [
    {
      tag: "div.editor-page",
      getAttrs: function (dom) {
        var style = dom.style,
          dataset = dom.dataset;
        var height = Number(
          style.height.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var width = Number(
          style.width.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var margin = "auto";
        var _a = style.backgroundColor.replace(/[A-Za-z$-()]/g, "").split(","),
          red = _a[0],
          green = _a[1],
          blue = _a[2];
        var background = rgbToHex(Number(red), Number(green), Number(blue));
        var orientation = dataset.orientation;
        var direction = dataset.direction;
        var indentLeft = Number(
          style.paddingLeft.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var indentRight = Number(
          style.paddingRight.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var indentTop = Number(
          style.paddingTop.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var indentBottom = Number(
          style.paddingBottom.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var rectoVerso = JSON.parse(dataset.rectoverso);
        return {
          height: height,
          width: width,
          margin: margin,
          background: background,
          orientation: orientation,
          direction: direction,
          indentBottom: indentBottom,
          indentTop: indentTop,
          indentLeft: indentLeft,
          indentRight: indentRight,
          rectoVerso: rectoVerso,
        };
      },
    },
  ],
  toDOM: function (node) {
    var _a;
    var _b = node.attrs,
      indentLeft = _b.indentLeft,
      indentRight = _b.indentRight,
      indentBottom = _b.indentBottom,
      indentTop = _b.indentTop,
      height = _b.height,
      width = _b.width,
      orientation = _b.orientation,
      background = _b.background,
      direction = _b.direction,
      rectoVerso = _b.rectoVerso;
    var attrs =
      ((_a = {}),
      (_a["data-rectoverso"] = rectoVerso),
      (_a["data-direction"] = direction),
      (_a["data-orientation"] = orientation),
      (_a.class = node.attrs.class),
      (_a.style =
        "direction:" +
        direction +
        ";padding-left:" +
        indentLeft +
        "mm; padding-right:" +
        indentRight +
        "mm;padding-top:" +
        indentTop +
        "mm;padding-bottom:" +
        indentBottom +
        "mm;background-color:" +
        background +
        ";"),
      _a);
    if (orientation === "portrait") {
      attrs.style += "width:" + width + "mm;height:" + height + "mm";
    } else {
      attrs.style += "width:" + height + "mm;height:" + width + "mm";
    }
    return ["div", attrs, 0];
  },
};

var CodeMarkSpec = {
  parseDOM: [{ tag: "code" }],
  toDOM: function () {
    return ["code", 0];
  },
};

var EMMarkSpec = {
  parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
  toDOM: function () {
    return ["em", 0];
  },
};

// @flow
var FontSizeMarkSpec = {
  attrs: {
    pt: { default: null },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      style: "font-size",
      getAttrs: getAttrs$5,
    },
  ],
  toDOM: function (node) {
    var pt = node.attrs.pt;
    var domAttrs = pt
      ? {
          style: "font-size: " + pt + "pt;",
          class: "czi-font-size-mark ProseMirror-fontSize-mark",
        }
      : null;
    return ["span", domAttrs, 0];
  },
};
function getAttrs$5(fontSize) {
  var attrs = {};
  if (!fontSize) {
    return attrs;
  }
  var ptValue = toClosestFontPtSize(fontSize);
  if (!ptValue) {
    return attrs;
  }
  return {
    pt: ptValue,
  };
}

var FONT_TYPE_NAMES = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Roboto",
  "Verdana",
];
var RESOLVED_FONT_NAMES = new Set(FONT_TYPE_NAMES);
var FontTypeMarkSpec = {
  attrs: {
    name: { default: "" },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      style: "font-family",
      getAttrs: function (name) {
        return {
          name: name ? name.replace(/[\"\']/g, "") : "",
        };
      },
    },
  ],
  toDOM: function (node) {
    var name = node.attrs.name;
    var attrs = {};
    if (name) {
      if (!RESOLVED_FONT_NAMES.has(name)) {
        // TODO: Cache custom fonts and preload them earlier.
        RESOLVED_FONT_NAMES.add(name);
        // https://github.com/typekit/webfontloader
        loader.load({ google: { families: [name] } });
      }
      attrs.style = "font-family: " + name;
    }
    return ["span", attrs, 0];
  },
};

var LinkMarkSpec = {
  attrs: {
    href: { default: null },
    rel: { default: "noopener noreferrer nofollow" },
    target: { default: "blank" },
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs: function (dom) {
        var href = dom.getAttribute("href");
        var target = href && href.indexOf("#") === 0 ? "" : "blank";
        return {
          href: dom.getAttribute("href"),
          title: dom.getAttribute("title"),
          target: target,
        };
      },
    },
  ],
  toDOM: function (node) {
    return ["a", node.attrs, 0];
  },
};

var DOM_ATTRIBUTE_SIZE = "data-spacer-size";
var SPACER_SIZE_TAB = "tab";
var SpacerMarkSpec = {
  attrs: {
    size: { default: SPACER_SIZE_TAB },
  },
  defining: true,
  draggable: false,
  excludes: "_",
  group: "inline",
  inclusive: false,
  inline: true,
  spanning: false,
  parseDOM: [
    {
      tag: "span[" + DOM_ATTRIBUTE_SIZE + "]",
      getAttrs: function (el) {
        return {
          size: el.getAttribute(DOM_ATTRIBUTE_SIZE) || SPACER_SIZE_TAB,
        };
      },
    },
  ],
  toDOM: function (node) {
    var _a;
    var size = node.attrs.size;
    return ["span", ((_a = {}), (_a[DOM_ATTRIBUTE_SIZE] = size), _a), 0];
  },
};

var StrikeMarkSpec = {
  parseDOM: [
    {
      style: "text-decoration",
      getAttrs: function (value) {
        return value === "line-through" && null;
      },
    },
  ],
  toDOM: function () {
    var style = "text-decoration: line-through";
    return ["span", { style: style }, 0];
  },
};

var STRONG_DOM = ["strong", 0];
var CSS_BOLD_PATTERN = /^(bold(er)?|[5-9]\d{2,})$/;
var StrongMarkSpec = {
  parseDOM: [
    { tag: "strong" },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    {
      tag: "b",
      getAttrs: function (node) {
        return node.style.fontWeight != "normal" && null;
      },
    },
    {
      style: "font-weight",
      getAttrs: function (value) {
        return CSS_BOLD_PATTERN.test(value) && null;
      },
    },
  ],
  toDOM: function () {
    return STRONG_DOM;
  },
};

var TextColorMarkSpec = {
  attrs: {
    color: {
      default: "",
    },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      style: "color",
      getAttrs: function (color) {
        return {
          color: toCSSColor(color),
        };
      },
    },
  ],
  toDOM: function (node) {
    var color = node.attrs.color;
    var style = "";
    if (color) {
      style += "color: " + color + ";";
    }
    return ["span", { style: style }, 0];
  },
};

var TextHighlightMarkSpec = {
  attrs: {
    highlightColor: {
      default: "",
    },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      tag: "span[style*=background-color]",
      getAttrs: function (dom) {
        var backgroundColor = dom.style.backgroundColor;
        var color = toCSSColor(backgroundColor);
        return {
          highlightColor: isTransparent(color) ? "" : color,
        };
      },
    },
  ],
  toDOM: function (node) {
    var highlightColor = node.attrs.highlightColor;
    var style = "";
    if (highlightColor) {
      style += "background-color: " + highlightColor + ";";
    }
    return ["span", { style: style }, 0];
  },
};

var NO_WRAP_DOM = ["nobr", 0];
var TextNoWrapMarkSpec = {
  parseDOM: [{ tag: "nobr" }],
  toDOM: function () {
    return NO_WRAP_DOM;
  },
};

var TextSelectionMarkSpec = {
  attrs: {
    id: {
      default: "",
    },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      tag: "czi-text-selection",
    },
  ],
  toDOM: function (_node) {
    return ["czi-text-selection", { class: "czi-text-selection" }, 0];
  },
};

var TextSuperMarkSpec = {
  parseDOM: [
    { tag: "sup" },
    {
      style: "vertical-align",
      getAttrs: function (value) {
        return value === "super" && null;
      },
    },
  ],
  toDOM: function () {
    return ["sup", 0];
  },
};

var TextUnderlineMarkSpec = {
  parseDOM: [
    { tag: "u" },
    {
      style: "text-decoration-line",
      getAttrs: function (value) {
        return value === "underline" && null;
      },
    },
    {
      style: "text-decoration",
      getAttrs: function (value) {
        return value === "underline" && null;
      },
    },
  ],
  toDOM: function () {
    return ["u", 0];
  },
};

var BackgroundColorMarkSpec = {
  attrs: {
    backgroundColor: { default: "" },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      tag: "span[style*=background-color]",
      getAttrs: function (dom) {
        var backgroundColor = dom.style.backgroundColor;
        var color = toCSSColor(backgroundColor);
        return {
          backgroundColor: isTransparent(color) ? "" : color,
        };
      },
    },
  ],
  toDOM: function (node) {
    var backgroundColor = node.attrs.backgroundColor;
    var style = "";
    if (backgroundColor) {
      style += "background-color: " + backgroundColor + ";";
    }
    return ["span", { style: style }, 0];
  },
};

var HeaderSpec = {
  attrs: {
    background: { default: "#efefef" },
    detached: { default: false },
  },
  content: "block+",
  group: "header",
  defining: true,
  isolating: true,
  toDOM: function (node) {
    var _a;
    var _b = node.attrs,
      background = _b.background,
      detached = _b.detached;
    var style = "";
    if (background) style += " background:" + background + ";";
    return [
      "div",
      ((_a = { style: style, class: "page-header" }),
      (_a["data-detached"] = detached),
      _a),
      0,
    ];
  },
  parseDOM: [
    {
      tag: "div.page-header",
      getAttrs: function (dom) {
        if (!dom.classList.contains("page-header")) {
          return;
        }
        var style = dom.style;
        var _a = style.backgroundColor.replace(/[A-Za-z$-()]/g, "").split(","),
          red = _a[0],
          green = _a[1],
          blue = _a[2];
        var background = rgbToHex(Number(red), Number(green), Number(blue));
        var detached = dom.dataset.detached === "true";
        return { background: background, detached: detached };
      },
    },
  ],
};

var FooterSpec = {
  attrs: {
    background: { default: "#efefef" },
    detached: { default: false },
  },
  content: "block+",
  group: "footer",
  toDOM: function (node) {
    var _a;
    var _b = node.attrs,
      background = _b.background,
      detached = _b.detached;
    var style = "";
    if (background) style += " background:" + background + ";";
    return [
      "div",
      ((_a = { style: style, class: "page-footer" }),
      (_a["data-detached"] = detached),
      _a),
      0,
    ];
  },
  parseDOM: [
    {
      tag: "div.page-footer",
      getAttrs: function (dom) {
        if (!dom.classList.contains("page-footer")) {
          return;
        }
        var style = dom.style;
        var _a = style.backgroundColor.replace(/[A-Za-z$-()]/g, "").split(","),
          red = _a[0],
          green = _a[1],
          blue = _a[2];
        var background = rgbToHex(Number(red), Number(green), Number(blue));
        var detached = dom.dataset.detached === "true";
        return { background: background, detached: detached };
      },
    },
  ],
};

var BodySpec = {
  attrs: {
    background: { default: "#e6e6e6" },
    indentLeft: { default: 5 },
    indentRight: { default: 5 },
    indentTop: { default: 5 },
    indentBottom: { default: 5 },
  },
  content: "block+",
  toDOM: function (node) {
    var _a = node.attrs,
      indentLeft = _a.indentLeft,
      indentRight = _a.indentRight,
      indentBottom = _a.indentBottom,
      indentTop = _a.indentTop,
      background = _a.background;
    var style =
      "display:block; position:relative;clear:both;margin-left:" +
      indentLeft +
      "mm; margin-right:" +
      indentRight +
      "mm;margin-top:" +
      indentTop +
      "mm;margin-bottom:" +
      indentBottom +
      "mm;";
    if (background) style += " background:" + background + ";";
    return ["div", { style: style, class: "page-body" }, 0];
  },
  parseDOM: [
    {
      tag: "div.page-body",
      getAttrs: function (dom) {
        var style = dom.style;
        var _a = style.backgroundColor.replace(/[A-Za-z$-()]/g, "").split(","),
          red = _a[0],
          green = _a[1],
          blue = _a[2];
        var background = rgbToHex(Number(red), Number(green), Number(blue));
        var indentLeft = Number(
          style.marginLeft.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var indentRight = Number(
          style.marginRight.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var indentTop = Number(
          style.marginTop.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        var indentBottom = Number(
          style.marginBottom.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        return {
          background: background,
          indentLeft: indentLeft,
          indentRight: indentRight,
          indentTop: indentTop,
          indentBottom: indentBottom,
        };
      },
    },
  ],
};

var EndNodeSpec = {
  attrs: {
    width: { default: 20 },
    background: { default: "#f6f8fa" },
    class: { default: "page-end" },
  },
  atom: true,
  draggable: false,
  defining: true,
  toDOM: function (node) {
    var _a = node.attrs,
      className = _a.class,
      width = _a.width,
      background = _a.background;
    var style = "width:" + width + "mm;background:" + background;
    return ["div", { style: style, class: className }];
  },
  parseDOM: [
    {
      tag: "div.page-end",
      getAttrs: function (dom) {
        var style = dom.style;
        var _a = style.backgroundColor.replace(/[A-Za-z$-()]/g, "").split(","),
          red = _a[0],
          green = _a[1],
          blue = _a[2];
        var background = rgbToHex(Number(red), Number(green), Number(blue));
        var width = Number(
          style.width.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        return { background: background, width: width };
      },
    },
  ],
};

var PageCounter = {
  attrs: {
    top: { default: 0 },
    left: { default: 0 },
    mode: { default: "full" },
  },
  content: "block?",
  group: "block",
  toDOM: function (node) {
    var _a = node.attrs,
      top = _a.top,
      left = _a.left,
      mode = _a.mode;
    var attrs = {};
    attrs.style =
      "position:absolute;min-width:10px;min-height:10px;background:red;";
    if (top) attrs.style += "top:" + top + "mm;";
    if (left) attrs.style += "left:" + left + "mm;";
    if (mode) attrs["data-mode"] = mode;
    attrs.class = "page-counter";
    return ["div", attrs, 0];
  },
  parseDOM: [
    {
      tag: "div.page-counter",
      getAttrs: function (dom) {
        if (!dom.classList.contains("page-counter")) {
          return;
        }
        var style = dom.style;
        var top = style.top.replace(/[A-Za-z$-()]/g, "").split(",");
        var left = style.left.replace(/[A-Za-z$-()]/g, "").split(",");
        return { top: top, left: left };
      },
    },
  ],
};

var StartNodeSpec = {
  attrs: {
    width: { default: 20 },
    background: { default: "#f6f8fa" },
    class: { default: "page-start" },
  },
  atom: true,
  draggable: false,
  defining: true,
  toDOM: function (node) {
    var _a = node.attrs,
      className = _a.class,
      width = _a.width,
      background = _a.background;
    var style = "width:" + width + "mm;background:" + background;
    return ["div", { style: style, class: className }];
  },
  parseDOM: [
    {
      tag: "div.page-start",
      getAttrs: function (dom) {
        var style = dom.style;
        var _a = style.backgroundColor.replace(/[A-Za-z$-()]/g, "").split(","),
          red = _a[0],
          green = _a[1],
          blue = _a[2];
        var background = rgbToHex(Number(red), Number(green), Number(blue));
        var width = Number(
          style.width.replace(/[A-Za-z$-()]/g, "").split(",")[0]
        );
        return { background: background, width: width };
      },
    },
  ],
};

var _a, _b;
var marks =
  ((_a = {}),
  (_a[MARK_LINK] = LinkMarkSpec),
  (_a[MARK_NO_BREAK] = TextNoWrapMarkSpec),
  (_a[MARK_CODE] = CodeMarkSpec),
  (_a[MARK_EM] = EMMarkSpec),
  (_a[MARK_FONT_SIZE] = FontSizeMarkSpec),
  (_a[MARK_FONT_FAMILY] = FontTypeMarkSpec),
  (_a[MARK_SPACER] = SpacerMarkSpec),
  (_a[MARK_STRIKE] = StrikeMarkSpec),
  (_a[MARK_STRONG] = StrongMarkSpec),
  (_a[MARK_SUPER] = TextSuperMarkSpec),
  (_a[MARK_TEXT_COLOR] = TextColorMarkSpec),
  (_a[MARK_TEXT_HIGHLIGHT] = TextHighlightMarkSpec),
  (_a[MARK_BACKGROUND_COLOR] = BackgroundColorMarkSpec),
  (_a[MARK_TEXT_SELECTION] = TextSelectionMarkSpec),
  (_a[MARK_UNDERLINE] = TextUnderlineMarkSpec),
  _a);
var schema = new Schema({
  nodes: __assign(
    ((_b = {}),
    (_b[DOC] = DocNodeSpec),
    (_b[PAGE] = PageDragNodeSpec),
    (_b[PARAGRAPH] = ParagraphNodeSpec),
    (_b[BLOCKQUOTE] = BlockquoteNodeSpec),
    (_b[HORIZONTAL_RULE] = HorizontalRuleNode),
    (_b[HEADING] = HeadingNode),
    (_b[CODE_BLOCK] = CodeBlockNodeSpec),
    (_b[TEXT] = TextNodeSpec),
    (_b[IMAGE] = ImageNode),
    (_b[HARD_BREAK] = HardBreakNodeSpec),
    (_b[BULLET_LIST] = BulletListNodeSpec),
    (_b[ORDERED_LIST] = OrderedListNodeSpec),
    (_b[LIST_ITEM] = ListItemNodeSpec),
    (_b[HEADER] = HeaderSpec),
    (_b[FOOTER] = FooterSpec),
    (_b[BODY] = BodySpec),
    (_b[END] = EndNodeSpec),
    (_b[START] = StartNodeSpec),
    (_b[PAGE_COUNTER] = PageCounter),
    _b),
    TableNodesSpecs
  ),
  marks: marks,
});

export { key, paginationPlugin, schema };
