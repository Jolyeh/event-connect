export function reveal(node, options = {}) {
    const {
        threshold = 0.15,
        root = null,
        rootMargin = "0px 0px -10% 0px",
        once = true,
        delay = 0
    } = options;

    node.style.setProperty("--reveal-delay", `${delay}ms`);
    node.classList.add("reveal-init");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    node.classList.add("reveal-show");

                    if (once) {
                        observer.unobserve(node);
                    }
                } else if (!once) {
                    node.classList.remove("reveal-show");
                }
            });
        },
        {
            root,
            rootMargin,
            threshold
        }
    );

    observer.observe(node);

    return {
        update(newOptions = {}) {
            node.style.setProperty(
                "--reveal-delay",
                `${newOptions.delay ?? delay}ms`
            );
        },
        destroy() {
            observer.disconnect();
        }
    };
}