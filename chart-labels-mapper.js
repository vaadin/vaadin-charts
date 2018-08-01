window.Vaadin = window.Vaadin || {};
Vaadin.Charts = Vaadin.Charts || {};
/** @private */
// eslint-disable-next-line no-unused-vars
Vaadin.Charts.ChartLabelsMapper = (() => class {

  constructor(mapper) {
    const value = mapper || [];
    if (typeof value === 'string') {
      try {
        this.__tryPassFunction(value);
      } catch (ex) {
        try {
          this.__tryPassArrayOrObject(JSON.parse(value));
        } catch (parseEx) {
          console.warn(`VaadinChartSeries::ChartLabelsMapper: couldn't decode JSON attribute: ${value}`);
          this.__assignMapper([], 'array'); // Pass-through.
        }
      }
    } else if (this.__isFunction(value)) {
      this.__assignMapper(value, 'function');
    } else {
      this.__tryPassArrayOrObject(value);
    }
  }

  __isFunction(value) {
    return value && {}.toString.call(value) === '[object Function]';
  }

  __isObject(item) {
    return !Array.isArray(item) && typeof item === 'object';
  }

  __tryPassFunction(value) {
    const result = eval('(' + value + ')');
    if (!this.__isFunction(result)) {
      throw new SyntaxError(`Invalid function "${result}"`);
    }
    this.mapper = result;
    this.type = 'function';
  }

  __tryPassArrayOrObject(value) {
    if (Array.isArray(value)) {
      this.__assignMapper(value, 'array');
    } else if (typeof value === 'object') {
      this.__assignMapper(value, 'object');
    } else {
      console.warn(`VaadinChartSeries::ChartLabelsMapper: unsupported type for mapping property:
      ${typeof value} - ${value}. Will use the pass-through mapper instead`);
      this.__assignMapper([], 'array'); // Pass-through.
    }
  }

  __assignMapper(value, type) {
    this.mapper = value;
    this.type = type;
  }

  map(values, seriesType) {
    if (values) {
      if (this.type === 'array' && this.mapper.length === 0) {
        return values.slice();
      }
      const arrayMapper = this.__itemArrayToObjectMapperFactory(seriesType);
      return values.map((item, index) => {
        const result = this.__isObject(item) ? Object.assign({}, item) : {};

        if (Array.isArray(item)) {
          Object.assign(result, arrayMapper(item));
        } else if (!this.__isObject(item)) {
          result.y = item;
        }

        if (this.type === 'function') {
          result.name = this.mapper(result.y);
        } else if (this.type === 'object' && !!this.mapper[result.y]) {
          result.name = this.mapper[result.y];
        } else if (this.type === 'array' && this.mapper.length > index) {
          result.name = this.mapper[index];
        }

        return result;
      });
    }
  }
  /**
   * Creates a mapping function to convert an item of type Array to an Object
   * based on the type of the series (or the chart default type).
   *
   * @param {String} type the series (or chart default) type
   *
   * @returns a mapper function that converts `Array` → `Object` based on the type
   */
  __itemArrayToObjectMapperFactory(type) {
    switch (type) {
      case 'arearange':
      case 'columnrange':
      case 'areasplinerange':
      case 'errorbar':
        return (item) => {
          const result = {};

          if (item.length === 3) {
            [, result.low, result.high] = item;

            if (typeof item[0] === 'string') {
              [result.name] = item;
            } else {
              [result.x] = item;
            }
          } else {
            [result.low, result.high] = item;
          }
          return result;
        };
      case 'ohlc':
      case 'candlestick':
        return (item) => {
          const result = {};
          if (item.length === 5) {
            [, result.open, result.high, result.low, result.close] = item;
            if (typeof item[0] === 'string') {
              [result.name] = item;
            } else {
              [result.x] = item;
            }
          } else {
            [result.open, result.high, result.low, result.close] = item;
          }
          return result;
        };
      case 'boxplot':
        return (item) => {
          const result = {};

          if (item.length === 6) {
            [, result.low, result.q1, result.median, result.q3, result.high] = item;
            if (typeof item[0] === 'string') {
              [result.name] = item;
            } else {
              [result.x] = item;
            }
          } else {
            [result.low, result.q1, result.median, result.q3, result.high] = item;
          }
          return result;
        };
      case 'bubble':
      case 'variwide':
        return (item) => {
          const result = {};

          if (item.length === 3) {
            [, result.y, result.z] = item;
            if (typeof item[0] === 'string') {
              [result.name] = item;
            } else {
              [result.x] = item;
            }
          } else {
            [result.y, result.z] = item;
          }
          return result;
        };
      case 'bullet':
        return (item) => {
          const result = {};

          if (item.length === 3) {
            [, result.y, result.target] = item;
            if (typeof item[0] === 'string') {
              [result.name] = item;
            } else {
              [result.x] = item;
            }
          } else {
            [result.y, result.target] = item;
          }
          return result;
        };
      case 'heatmap':
      case 'tilemap':
        return (item) => {
          const result = {};

          if (item.length === 3) {
            [, result.y, result.value] = item;
            if (typeof item[0] === 'string') {
              [result.name] = item;
            } else {
              [result.x] = item;
            }
          } else {
            [result.y, result.value] = item;
          }
          return result;
        };
      case 'scatter3d':
        return (item) => {
          const result = {};

          [, result.y, result.z] = item;
          if (typeof item[0] === 'string') {
            [result.name] = item;
          } else {
            [result.x] = item;
          }
          return result;
        };
      case 'variablepie':
        return (item) => {
          const result = {};

          [result.y, result.z] = item;
          return result;
        };
      case 'vector':
      case 'windbard':
        return (item) => {
          const result = {};

          [result.x, result.y, result.length, result.direction] = item;
          return result;
        };
      case 'wordcloud':
        return (item) => {
          const result = {};

          [result.name, result.weight] = item;
          return result;
        };
      default:
        return (item) => {
          const result = {};

          if (typeof item[0] === 'string') {
            [result.name, result.y] = item;
          } else {
            [result.x, result.y] = item;
          }
          return result;
        };
    }
  }
})();
