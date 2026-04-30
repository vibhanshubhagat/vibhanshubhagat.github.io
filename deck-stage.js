customElements.define(
  "deck-stage",
  class extends HTMLElement {
    connectedCallback() {
      this.style.display = "block";
      this._dw = +(this.getAttribute("width") || 1920);
      this._dh = +(this.getAttribute("height") || 1080);
      this._onResize = () => this._scale();
      window.addEventListener("resize", this._onResize);
      // Children aren't parsed yet when connectedCallback fires from <head> script,
      // so defer wrap + scale until after the current parse turn.
      setTimeout(() => {
        this._wrap();
        this._scale();
      }, 0);
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this._onResize);
    }

    _wrap() {
      if (this._wrapped) return;
      this._wrapped = true;
      [...this.querySelectorAll(":scope > section")].forEach((sec) => {
        const shell = document.createElement("div");
        shell.className = "__deck-shell";
        shell.style.cssText = "overflow:hidden;width:100%;";
        sec.parentNode.insertBefore(shell, sec);
        shell.appendChild(sec);
      });
    }

    _scale() {
      const scale = window.innerWidth / this._dw;
      this.querySelectorAll(":scope > .__deck-shell").forEach((shell) => {
        const sec = shell.firstElementChild;
        if (!sec) return;
        shell.style.height = this._dh * scale + "px";
        sec.style.width = this._dw + "px";
        sec.style.height = this._dh + "px";
        sec.style.transform = `scale(${scale})`;
        sec.style.transformOrigin = "top left";
      });
    }
  }
);
