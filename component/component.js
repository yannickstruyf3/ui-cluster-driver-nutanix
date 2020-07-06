/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
// https://github.com/rancher/ui/blob/master/lib/shared/addon/mixins/cluster-driver.js
import ClusterDriver from 'shared/mixins/cluster-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed = Ember.computed;
const observer = Ember.observer;
const get = Ember.get;
const set = Ember.set;
const alias = Ember.computed.alias;
const service = Ember.inject.service;
const all = Ember.RSVP.all;

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const reclaimPolicyMap = {
  'Delete': 'Delete',
  'Retain': 'Retain',
}
const filesystemMap = {
  'ext4': 'ext4',
  'xfs': 'xfs',
}

const karbonVersionAndChoicesMap = {
  '2.1': {
    '1.16.10-0': '1.16.10-0',
    '1.15.12-0': '1.15.12-0',
    '1.14.10-1': '1.14.10-1',
    '1.13.12-1': '1.13.12-1',
  },
  '2.0': {
    '1.16.8-0': '1.16.8-0',
    '1.15.10-0': '1.15.10-0',
    '1.14.10-0': '1.14.10-0',
    '1.13.12-0': '1.13.12-0',
  },
}

// const karbonVersionMap = {
//   '2.1': '2.1',
//   '2.0': '2.0',
// }

// const versionChoicesMap = {
//   '1.16.8-0': '1.16.8-0',
//   '1.15.10-0': '1.15.10-0',
//   '1.14.10-0': '1.14.10-0',
//   '1.13.12-0': '1.13.12-0',
// }

/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName: '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig', // 'googleKubernetesEngineConfig'
  app: service(),
  router: service(),
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  init() {
    /*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'shared/components/cluster-driver/driver-%%DRIVERNAME%%/template'
    });
    set(this, 'layout', template);

    this._super(...arguments);
    /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

    let config = get(this, 'config');
    let configField = get(this, 'configField');


    if (!config) {
      config = this.get('globalStore').createRecord({
        type: configField,
        endpoint: "",
        username: "",
        password: "",
        insecure: false,
        workernodes: 1,
        image: "",
        version: "1.16.8-0",
        karbonversion: "2.0",
        cluster: "",
        vmnetwork: "",
        workercpu: 8,
        workermemorymib: 8192,
        workerdiskmib: 122880,
        mastercpu: 2,
        mastermemorymib: 4096,
        masterdiskmib: 122880,
        etcdcpu: 4,
        etcdmemorymib: 8192,
        etcddiskmib: 40960,
        clusteruser: "",
        clusterpassword: "",
        storagecontainer: "",
        filesystem: "ext4",
        reclaimpolicy: "Delete",
        flashmode: false
      });

      set(this, 'cluster.%%DRIVERNAME%%EngineConfig', config);
    }
  },

  config: alias('cluster.%%DRIVERNAME%%EngineConfig'),


  actions: {
    save() {
      this.send('driverSave');
    },
    cancel() {
      console.log("Cancel")
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
    },
  },


  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors') || [];
    if (!get(this, 'cluster.name')) {
      errors.push('Name is required');
    }

    // Add more specific errors
    // Set the array of errors for display,
    // and return true if saving should continue.
    if (get(errors, 'length')) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here
  reclaimPolicyChoices: Object.entries(reclaimPolicyMap).map((e) => ({
    label: e[1],
    value: e[0]
  })),
  filesystemChoices: Object.entries(filesystemMap).map((e) => ({
    label: e[1],
    value: e[0]
  })),
  // versionChoices: Object.entries(versionChoicesMap).map((e) => ({
  //   label: e[1],
  //   value: e[0]
  // })),
  versionChoices: computed('cluster.%%DRIVERNAME%%EngineConfig.karbonversion', function () {
    let karbonVersion = get(this, 'cluster.%%DRIVERNAME%%EngineConfig.karbonversion');
    console.log("karbonVersion: " + karbonVersion)
    console.log("karbonVersionAndChoicesMap[karbonVersion]: " + karbonVersionAndChoicesMap[karbonVersion])
    return Object.entries(karbonVersionAndChoicesMap[karbonVersion]).map((e) => ({
      label: e[0],
      value: e[0]
    }))
  }),

  // karbonVersionChoices: Object.entries(karbonVersionMap).map((e) => ({
  //   label: e[1],
  //   value: e[0]
  // })),
  karbonVersionChoices: Object.entries(karbonVersionAndChoicesMap).map((e) => ({
    label: e[0],
    value: e[0]
  })),

});

