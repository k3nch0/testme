class PredictiveSearch extends HTMLElement{constructor(){super(),this.cachedResults={},this.input=this.querySelector('input[type="search"]'),this.predictiveSearchResults=this.querySelector("[data-predictive-search]"),this.setupEventListeners()}setupEventListeners(){this.querySelector("form.search").addEventListener("submit",this.onFormSubmit.bind(this)),this.input.addEventListener("input",debounce(t=>{this.onChange(t)},300).bind(this)),this.input.addEventListener("focus",this.onFocus.bind(this)),this.addEventListener("focusout",this.onFocusOut.bind(this)),this.addEventListener("keyup",this.onKeyup.bind(this)),this.addEventListener("keydown",this.onKeydown.bind(this))}getQuery(){return this.input.value.trim()}onChange(){const t=this.getQuery();t.length?this.getSearchResults(t):this.close(!0)}onFormSubmit(t){this.getQuery().length&&!this.querySelector('[aria-selected="true"] a')||t.preventDefault()}onFocus(){const t=this.getQuery();t.length&&("true"===this.getAttribute("results")?this.open():this.getSearchResults(t))}onFocusOut(){setTimeout(()=>{this.contains(document.activeElement)||this.close()})}onKeyup(t){switch(this.getQuery().length||this.close(!0),t.preventDefault(),t.code){case"ArrowUp":this.switchOption("up");break;case"ArrowDown":this.switchOption("down");break;case"Enter":this.selectOption()}}onKeydown(t){"ArrowUp"!==t.code&&"ArrowDown"!==t.code||t.preventDefault()}switchOption(t){if(!this.getAttribute("open"))return;const e="up"===t,s=this.querySelector('[aria-selected="true"]'),i=this.querySelectorAll("li");let r=this.querySelector("li");e&&!s||(this.statusElement.textContent="",!e&&s?r=s.nextElementSibling||i[0]:e&&(r=s.previousElementSibling||i[i.length-1]),r!==s&&(r.setAttribute("aria-selected",!0),s&&s.setAttribute("aria-selected",!1),this.setLiveRegionText(r.textContent),this.input.setAttribute("aria-activedescendant",r.id)))}selectOption(){const t=this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');t&&t.click()}getSearchResults(t){const e=t.replace(" ","-").toLowerCase();this.setLiveRegionLoadingState(),this.cachedResults[e]?this.renderSearchResults(this.cachedResults[e]):fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(t)}&${encodeURIComponent("resources[type]")}=product&${encodeURIComponent("resources[limit]")}=4&section_id=predictive-search`).then(t=>{if(!t.ok){var e=new Error(t.status);throw this.close(),e}return t.text()}).then(t=>{const s=(new DOMParser).parseFromString(t,"text/html").querySelector("#shopify-section-predictive-search").innerHTML;this.cachedResults[e]=s,this.renderSearchResults(s)}).catch(t=>{throw this.close(),t})}setLiveRegionLoadingState(){this.statusElement=this.statusElement||this.querySelector(".predictive-search-status"),this.loadingText=this.loadingText||this.getAttribute("data-loading-text"),this.setLiveRegionText(this.loadingText),this.setAttribute("loading",!0)}setLiveRegionText(t){this.statusElement.setAttribute("aria-hidden","false"),this.statusElement.textContent=t,setTimeout(()=>{this.statusElement.setAttribute("aria-hidden","true")},1e3)}renderSearchResults(t){this.predictiveSearchResults.innerHTML=t,this.setAttribute("results",!0),this.setLiveRegionResults(),this.open()}setLiveRegionResults(){this.removeAttribute("loading"),this.setLiveRegionText(this.querySelector("[data-predictive-search-live-region-count-value]").textContent)}getResultsMaxHeight(){return this.resultsMaxHeight=window.innerHeight-document.getElementById("shopify-section-header").getBoundingClientRect().bottom,this.resultsMaxHeight}open(){this.predictiveSearchResults.style.maxHeight=this.resultsMaxHeight||`${this.getResultsMaxHeight()}px`,this.setAttribute("open",!0),this.input.setAttribute("aria-expanded",!0)}close(t=!1){t&&(this.input.value="",this.removeAttribute("results"));const e=this.querySelector('[aria-selected="true"]');e&&e.setAttribute("aria-selected",!1),this.input.setAttribute("aria-activedescendant",""),this.removeAttribute("open"),this.input.setAttribute("aria-expanded",!1),this.resultsMaxHeight=!1,this.predictiveSearchResults.removeAttribute("style")}}customElements.define("predictive-search",PredictiveSearch);