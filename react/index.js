'use strict'

var DefaultEventPluginOrder = require('react/lib/DefaultEventPluginOrder');
var DOMChildrenOperations = require('react/lib/DOMChildrenOperations');
var DOMLazyTree = require('react/lib/DOMLazyTree');
var ReactDOMComponentTree = require('react/lib/ReactDOMComponentTree');
var EventConstants = require('react/lib/EventConstants');
var EventPluginRegistry = require('react/lib/EventPluginRegistry');
var EventPluginUtils = require('react/lib/EventPluginUtils');
var EventPropagators = require('react/lib/EventPropagators');
var ReactBrowserEventEmitter = require('react/lib/ReactBrowserEventEmitter');
var ReactInjection = require('react/lib/ReactInjection');
var SyntheticEvent = require('react/lib/SyntheticEvent');
var keyOf = require('fbjs/lib/keyOf');
var Polymer = global.Polymer;

// check if element is a vaadin-chart
function isVaadinChart(element) {
    return element.nodeName && element.nodeName.indexOf('VAADIN-') !== -1 && element.nodeName.indexOf('-CHART') !== -1;
}

var customTopLevelTypes = {};
var VaadinChartsReactPlugin = {
    eventTypes: {},

    // Bubble vaadin-charts events to the original chart element
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var targetNode = targetInst && ReactDOMComponentTree.getNodeFromInstance(targetInst);
        if (!customTopLevelTypes.hasOwnProperty(topLevelType) ||
            !isVaadinChart(targetNode)) {
            return null;
        }
        var event = SyntheticEvent.getPooled(
            customTopLevelTypes[topLevelType],
            targetInst,
            nativeEvent,
            nativeEventTarget
        );
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
    }
};

var registeredEvents = [];

/**
 * Register an event to listen Vaadin Chart events.
 * Complete list of events at the bottom of this file.
 * @param {string} name the event name (e.g. 'chart-loaded')
 * @param {object|string} bubbled listener attribute name as an object key (e.g. {onChange: true} or 'on-chart-loaded')
 */
function registerEvent(name, bubbled) {
    injectAll();
    if (typeof bubbled !== 'string') {
        bubbled = keyOf(bubbled);
    }

    var captured = bubbled + 'Captured';
    var regEventBubbled = registeredEvents.some(function(reg) {
      return reg.name === name || reg.bubbled === bubbled;
    });
    if (regEventBubbled) {
        return;
    }
    registeredEvents.push({
        name: name,
        bubbled: bubbled
    });

    var topLevelType = 'top-custom' + bubbled;
    var dispatchConfig = {
        phasedRegistrationNames: {
            bubbled: bubbled,
            captured: captured
        },
        dependencies: [topLevelType]
    };

    EventConstants.topLevelTypes[topLevelType] = topLevelType;

    ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
        topLevelType,
        name,
        document
    );

    VaadinChartsReactPlugin.eventTypes[bubbled] =
        EventPluginRegistry.eventNameDispatchConfigs[bubbled] =
        customTopLevelTypes[topLevelType] = dispatchConfig;

    EventPluginRegistry.registrationNameModules[bubbled] =
        EventPluginRegistry.registrationNameModules[captured] = VaadinChartsReactPlugin;

    EventPluginRegistry.registrationNameDependencies[bubbled] =
        EventPluginRegistry.registrationNameDependencies[captured] =
        dispatchConfig.dependencies;
}

var attributes = [];

/**
 * Register a custom attribute of vaadin-charts.
 * Full list of attributes in bottom of this file.
 * @param string name the attribute name
 */
function registerAttribute(name) {
    injectAll();
    if (attributes.indexOf(name) !== -1) {
        return;
    }
    attributes.push(name);
}

var isInjected = false;

function injectAll() {
    if (isInjected) {
        return;
    }
    isInjected = true;

    require('react'); // make sure it's loaded
    require('react/lib/ReactDOM');

    ReactInjection.EventPluginHub.injectEventPluginsByName({
        VaadinChartsReactPlugin: VaadinChartsReactPlugin
    });

    ReactInjection.DOMProperty.injectDOMPropertyConfig({
        isCustomAttribute: function(name) {
            return attributes.indexOf(name) !== -1;
        }
    });
}

if (EventPluginUtils.injection.Mount) {
    throw new Error('vaadin-charts-react must be required before react');
}
// must be called before require('react') is called the first time
DefaultEventPluginOrder.push(keyOf({
    VaadinChartsReactPlugin: null
}));

// Fix light DOM issues
function fixLightDom() {
  var ShadyDOMChildrenOperations = require('./ShadyDOMChildrenOperations');
  DOMChildrenOperations.replaceDelimitedText = ShadyDOMChildrenOperations.replaceDelimitedText;
  DOMChildrenOperations.processUpdates = ShadyDOMChildrenOperations.processUpdates;

  var ShadyDOMLazyTree = require('./ShadyDOMLazyTree');
  DOMLazyTree.insertTreeBefore = ShadyDOMLazyTree.insertTreeBefore;
  DOMLazyTree.replaceChildWithTree = ShadyDOMLazyTree.replaceChildWithTree;
  DOMLazyTree.queueChild = ShadyDOMLazyTree.queueChild;
  DOMLazyTree.queueHTML = ShadyDOMLazyTree.queueHTML;
  DOMLazyTree.queueText = ShadyDOMLazyTree.queueText;
}

if (Polymer) {
  var useShadyDOM = Polymer && !Polymer.Settings.useNativeShadow;
  if (useShadyDOM) {
    fixLightDom();
  }
} else {
  document.addEventListener('WebComponentsReady', function() {
    Polymer = global.Polymer;
    var useShadyDOM = Polymer && !Polymer.Settings.useNativeShadow;
    if (useShadyDOM) {
      fixLightDom();
    }
  });
}

/**
 *  Name of the chart events to add to the configuration and its corresponding event for the chart element
 **/
registerEvent('chart-loaded', 'on-chart-loaded');
registerEvent('add-series', 'on-add-series');
registerEvent('after-print', 'on-after-print');
registerEvent('before-print', 'on-before-print');
registerEvent('chart-click', 'on-chart-click');
registerEvent('drilldown', 'on-drilldown');
registerEvent('drillup', 'on-drillup');
registerEvent('redraw', 'on-redraw');
registerEvent('selection', 'on-selection');

/**
 *  Name of the series events to add to the configuration and its corresponding event for the chart element
 **/
registerEvent('series-after-animate', 'on-series-after-animate');
registerEvent('series-checkbox-click', 'on-series-checkbox-click');
registerEvent('series-click', 'on-series-click');
registerEvent('series-hide', 'on-series-hide');
registerEvent('series-legend-item-click', 'on-series-legend-item-click');
registerEvent('series-mouse-out', 'on-series-mouse-out');
registerEvent('series-mouse-over', 'on-series-mouse-over');
registerEvent('series-show', 'on-series-show');

/**
 *  Name of the point events to add to the configuration and its corresponding event for the chart element
 **/
registerEvent('point-click', 'on-point-click');
registerEvent('point-mouse-out', 'on-point-mouse-out');
registerEvent('point-mouse-over', 'on-point-mouse-over');
registerEvent('point-remove', 'on-point-remove');
registerEvent('point-select', 'on-point-select');
registerEvent('point-unselect', 'on-point-unselect');
registerEvent('point-update', 'on-point-update');

/**
 *  Array of custom attributes used in vaadin-charts
 **/
var attributes = ['active-axis-label-style', 'active-color', 'active-data-label-style', 'adapt-to-updated-data', 'align', 'align-ticks', 'all-buttons-enabled', 'allow-decimals', 'allow-html', 'allow-overlap', 'allow-point-drilldown', 'allow-point-select', 'alpha', 'alternate-grid-color', 'animation', 'approximation', 'arrow-size', 'attr', 'attributes', 'auto-rotation', 'auto-rotation-limit', 'back', 'background', 'background-color', 'bar-background-color', 'bar-border-color', 'bar-border-radius', 'bar-border-width', 'base-series', 'beta', 'border-color', 'border-radius', 'border-width', 'bottom', 'break-size', 'breaks', 'button-arrow-color', 'button-background-color', 'button-border-color', 'button-border-radius', 'button-border-width', 'button-options', 'button-spacing', 'button-theme', 'buttons', 'categories', 'ceiling', 'center', 'change-decimals', 'chart', 'chart-frame', 'chart-options', 'chart-style', 'chart-title', 'class-name', 'color', 'columns', 'compare', 'connect-ends', 'connect-nulls', 'context-button', 'crop', 'crop-threshold', 'crosshair', 'crosshairs', 'csv', 'cursor', 'dash-style', 'data', 'data-grouping', 'data-labels', 'date-format', 'date-time-label-formats', 'decimal-point', 'default-series-type', 'defer', 'depth', 'distance', 'drill-up-button', 'drilldown', 'enable-mouse-tracking', 'enabled', 'end-angle', 'end-column', 'end-on-tick', 'end-row', 'fallback-to-export-server', 'filename', 'fill-color', 'fill-opacity', 'first-row-as-names', 'floating', 'floor', 'follow-pointer', 'follow-touch-move', 'footer-format', 'forced', 'form-attributes', 'format', 'from', 'gap-size', 'get-extremes-from-all', 'google-spreadsheet-key', 'google-spreadsheet-worksheet', 'grid-line-color', 'grid-line-dash-style', 'grid-line-width', 'grid-zIndex', 'group-pixel-width', 'halo', 'handles', 'header-format', 'height', 'hide-delay', 'hide-duration', 'hover', 'href', 'html', 'id', 'ignore-hidden-series', 'inactive-color', 'index', 'input-box-border-color', 'input-box-height', 'input-box-style', 'input-box-width', 'input-date-format', 'input-edit-date-format', 'input-enabled', 'input-position', 'input-style', 'inside', 'inverted', 'item-delimiter', 'item-distance', 'item-hidden-style', 'item-hover-style', 'item-margin-bottom', 'item-margin-top', 'item-style', 'item-width', 'items', 'keys', 'label', 'label-format', 'label-style', 'labels', 'layout', 'legend-index', 'line-color', 'line-delimiter', 'line-height', 'line-width', 'line-width-plus', 'linecap', 'linked-to', 'live-redraw', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'marker', 'mask-fill', 'mask-inside', 'max', 'max-height', 'max-padding', 'max-stagger-lines', 'max-zoom', 'menu-item-hover-style', 'menu-item-style', 'menu-items', 'menu-style', 'min', 'min-padding', 'min-range', 'min-tick-interval', 'min-width', 'minor-grid-line-color', 'minor-grid-line-dash-style', 'minor-grid-line-width', 'minor-tick-color', 'minor-tick-interval', 'minor-tick-length', 'minor-tick-position', 'minor-tick-width', 'name', 'navigation', 'negative-color', 'negative-fill-color', 'observers', 'offset', 'opacity', 'opposite', 'options3d', 'ordinal', 'outline-color', 'outline-width', 'overflow', 'padding', 'pan-key', 'panning', 'pinch-type', 'plot-background-color', 'plot-background-image', 'plot-bands', 'plot-border-color', 'plot-border-width', 'plot-lines', 'plot-shadow', 'point', 'point-format', 'point-interval', 'point-interval-unit', 'point-placement', 'point-range', 'point-start', 'polar', 'position', 'radius', 'radius-plus', 'range', 'reflow', 'relative-to', 'render-to', 'repeat', 'reserve-space', 'reset-zoom-button', 'reversed', 'rifle-color', 'rotation', 'rows', 'rtl', 'scale', 'select', 'selected', 'selection-marker-fill', 'series', 'series-mapping', 'shadow', 'shape', 'shared', 'show-axes', 'show-checkbox', 'show-duration', 'show-empty', 'show-first-label', 'show-in-legend', 'show-last-label', 'side', 'size', 'smoothed', 'snap', 'soft-threshold', 'source-height', 'source-width', 'spacing', 'spacing-bottom', 'spacing-left', 'spacing-right', 'spacing-top', 'stack', 'stacking', 'stagger-lines', 'start-angle', 'start-column', 'start-of-week', 'start-on-tick', 'start-row', 'states', 'step', 'sticky-tracking', 'switch-rows-and-columns', 'symbol', 'symbol-fill', 'symbol-height', 'symbol-padding', 'symbol-radius', 'symbol-size', 'symbol-stroke', 'symbol-stroke-width', 'symbol-width', 'symbol-x', 'symbol-y', 'table', 'text', 'text-align', 'theme', 'threshold', 'tick-amount', 'tick-color', 'tick-interval', 'tick-length', 'tick-pixel-interval', 'tick-position', 'tick-positions', 'tick-width', 'tickmark-placement', 'timeline', 'to', 'tooltip', 'track-background-color', 'track-border-color', 'track-border-radius', 'track-border-width', 'track-by-area', 'turbo-threshold', 'type', 'units', 'url', 'use-html', 'value', 'value-decimals', 'value-prefix', 'value-suffix', 'vertical-align', 'view-distance', 'visible', 'width', 'x', 'x-axis', 'x-date-format', 'y', 'y-axis', 'z-index', 'zone-axis', 'zones', 'zoom-type'];

attributes.forEach(function(attribute) {
    registerAttribute(attribute);
});
