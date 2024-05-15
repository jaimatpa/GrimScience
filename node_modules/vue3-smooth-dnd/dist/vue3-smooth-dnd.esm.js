import { defineComponent, h } from 'vue';
import { smoothDnD, dropHandlers, constants } from 'smooth-dnd';
export * from 'smooth-dnd';

/**
 * Checks if tag or tag.value (ref) is string function or object
 * @param {*} tag 
 * @returns boolean
 */
function validateTagProp (tag) {
  if (tag) {
    if (typeof tag === 'string') return true;
    if (typeof tag === 'object') {
      if (
        typeof tag.value === 'string' ||
        typeof tag.value === 'function' ||
        typeof tag.value === 'object'
      ) {
        return true;
      }
    }
    return false;
  }
  return true;
}

function getTagProps (ctx, tagClasses) {
  const tag = ctx.$props.tag;
  if (tag) {
    if (typeof tag === 'string') {
      const result = { value: tag };
      if (tagClasses) {
        result.props = { class: tagClasses };
      }
      return result;
    } else if (typeof tag === 'object') {
      const result = { value: tag.value || 'div', props: tag.props || {} };
      if (tagClasses) {
        if (result.props.class) {
          if (Array.isArray(result.props.class)) {
            result.props.class.push(tagClasses);
          } else {
            result.props.class = [tagClasses, result.props.class];
          }
        } else {
          result.props.class = tagClasses;
        }
      }
      return result;
    }
  }
  return { value: 'div' };
}

smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler;
smoothDnD.wrapChild = false;

const eventEmitterMap = {
  'drag-start': 'onDragStart',
  'drag-end': 'onDragEnd',
  'drop': 'onDrop',
  'drag-enter': 'onDragEnter',
  'drag-leave': 'onDragLeave',
  'drop-ready': 'onDropReady'
};

var Container = defineComponent({
  name: 'Container',
  mounted () {
    // emit events
    const options = Object.assign({}, this.$props);
    for (const key in eventEmitterMap) {
      options[eventEmitterMap[key]] = (props) => {
        this.$emit(key, props);
      };
    }
    this.containerElement = this.$refs.container || this.$el;
    this.container = smoothDnD(this.containerElement, options);
  },
  unmounted () {
    if (this.container) {
      try {
        this.container.dispose();
      } catch {
        // ignore
      }
    }
  },
  emits: ['drop', 'drag-start', 'drag-end', 'drag-enter', 'drag-leave', 'drop-ready' ],
  props: {
    orientation: { type: String, default: 'vertical' },
    removeOnDropOut: { type: Boolean, default: false },
    autoScrollEnabled: { type: Boolean, default: true },
    animationDuration: { type: Number, default: 250 },
    behaviour: String,
    groupName: String,
    dragHandleSelector: String,
    nonDragAreaSelector: String,
    lockAxis: String,
    dragClass: String,
    dropClass: String,
    dragBeginDelay: Number,
    getChildPayload: Function,
    shouldAnimateDrop: Function,
    shouldAcceptDrop: Function,
    getGhostParent: Function,
    dropPlaceholder: [Object, Boolean],
    tag: {
      validator: validateTagProp,
      default: 'div',
    }
  },
  render(){
    const tagProps = getTagProps(this);
    return h(
      tagProps.value,
      Object.assign({}, { ref: 'container' }, tagProps.props),
      this.$slots.default(),
    );
  }
});

var Draggable = defineComponent({
  name: 'Draggable',
  props: {
    tag: {
      validator: validateTagProp,
      default: 'div'
    },
  },
  render: function () {
    //wrap child
    const tagProps = getTagProps(this, constants.wrapperClass);
    return h(
      tagProps.value,
      Object.assign({}, tagProps.props),
      this.$slots.default()
    );
  }
});

export { Container, Draggable };
//# sourceMappingURL=vue3-smooth-dnd.esm.js.map
