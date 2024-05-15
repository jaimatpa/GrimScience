import { interrupt } from 'd3-transition';

function smartTransition(selection, duration, easing) {
    selection.nodes().forEach(node => interrupt(node)); // Interrupt active transitions if any
    if (duration) {
        const transition = selection.transition().duration(duration);
        if (easing)
            transition.ease(easing);
        return transition;
    }
    else
        return selection;
}

export { smartTransition };
//# sourceMappingURL=d3.js.map
