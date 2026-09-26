// H4 ERP - Application Core
// Phase 1 foundation

'use strict';

const H4ERP = {
    version: '1.0.0',
    initialized: false,

    init() {
        this.initialized = true;
        console.log('H4 ERP initialized');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    H4ERP.init();
});
