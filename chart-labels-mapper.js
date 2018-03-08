// eslint-disable-next-line no-unused-vars
class ChartLabelsMapper {

  constructor(mapper) {
    const value = mapper || [];
    if (typeof value === 'string') {
      try {
        this.__tryPassFunction(value);
      } catch (ex) {
        this.__tryPassArrayOrObject(JSON.parse(value));
      }
    } else if (Array.isArray(value)) {
      this.__assignMapper(value, 'array');
    } else if (this.__isFunction(value)) {
      this.__assignMapper(value, 'function');
    } else if (typeof value === 'object') {
      this.__assignMapper(value, 'object');
    } else {
      throw new SyntaxError(`Unrecognized mapper type: ${typeof value}. 
      Supported types are Array, Object, Function or a string representation of the aforementioned.`);
    }
  }

  // Because transpiled JS for IE11 doesn't handle instance.constructor.name properly
  getClassName() {
    return 'ChartLabelsMapper';
  }

  __isFunction(value) {
    return value && {}.toString.call(value) === '[object Function]';
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
      throw new SyntaxError('Error parsing mapping property');
    }
  }

  __assignMapper(value, type) {
    this.mapper = value;
    this.type = type;
  }

  map(values) {
    if (values) {
      return values.map((e, index) => {
        const result = {};
        result.y = e;
        result.name = this.type === 'function' ? this.mapper(e) : this.mapper[this.type === 'array' ? index : e] || e;
        return result;
      });
    }
  }
}
