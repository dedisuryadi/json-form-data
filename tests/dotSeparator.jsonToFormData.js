describe('jsonToFormData with dot separator', function () {
  it('should not append null or undefined values with useDotSeparator', function () {

    let testObject = {
      prop1: null,
      prop2: undefined
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.has('prop1')).to.equal(false);
    expect(formDataResult.has('prop2')).to.equal(false);
  });

  it('should convert true to 1 and false to 0 with useDotSeparator', function () {

    let testObject = {
      prop1: true,
      prop2: false
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop1')).to.equal('1');
    expect(formDataResult.get('prop2')).to.equal('0');
  });

  it('should convert arrays with useDotSeparator', function () {

    let testObject = {
      prop1: [11, 'test', true, false]
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop1[0]')).to.equal('11');
    expect(formDataResult.get('prop1[1]')).to.equal('test');
    expect(formDataResult.get('prop1[2]')).to.equal('1');
    expect(formDataResult.get('prop1[3]')).to.equal('0');
  });

  it('should convert a shallow object with useDotSeparator', function () {

    let file = new Blob(['file contents'], {type: 'text/plain'});
    file.name = "filename.txt";

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false,
      prop7: file
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop1')).to.equal('test');
    expect(formDataResult.get('prop2')).to.equal('2');
    expect(formDataResult.get('prop5')).to.equal('1');
    expect(formDataResult.get('prop6')).to.equal('0');

    expect(formDataResult.get('prop7').name).to.equal('filename.txt');
    expect(formDataResult.get('prop7').type).to.equal('text/plain');
  });

  it('should convert a nested object', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false,
      prop7: {
        prop1: 'test',
        prop2: 2,
        prop3: null,
        prop4: undefined,
        prop5: true,
        prop6: false
      }
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop7.prop1')).to.equal('test');
    expect(formDataResult.get('prop7.prop2')).to.equal('2');
    expect(formDataResult.get('prop7.prop5')).to.equal('1');
    expect(formDataResult.get('prop7.prop6')).to.equal('0');
  });

  it('should convert an object nested 3 levels deep with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false,
      prop7: {
        prop1: 'test',
        prop2: 2,
        prop3: null,
        prop4: undefined,
        prop5: true,
        prop6: false,
        prop7: {
          prop1: 'test',
          prop2: 2,
          prop3: null,
          prop4: undefined,
          prop5: true,
          prop6: false
        }
      }
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop7.prop7.prop1')).to.equal('test');
    expect(formDataResult.get('prop7.prop7.prop2')).to.equal('2');
    expect(formDataResult.get('prop7.prop7.prop5')).to.equal('1');
    expect(formDataResult.get('prop7.prop7.prop6')).to.equal('0');
  });

  it('should convert an array nested within an object with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false,
      prop7: {
        prop1: 'test',
        prop2: 2,
        prop3: null,
        prop4: undefined,
        prop5: true,
        prop6: false,
        prop7: [11, 'test', true, false]
      }
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop7.prop7[0]')).to.equal('11');
    expect(formDataResult.get('prop7.prop7[1]')).to.equal('test');
    expect(formDataResult.get('prop7.prop7[2]')).to.equal('1');
    expect(formDataResult.get('prop7.prop7[3]')).to.equal('0');
  });

  it('should convert an object deeply nested within an array with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false,
      prop7: {
        prop1: 'test',
        prop2: 2,
        prop3: null,
        prop4: undefined,
        prop5: true,
        prop6: false,
        prop7: [11, 'test', true, false, {prop1: 'foo', prop2: 'bar'}]
      }
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop7.prop7[4].prop1')).to.equal('foo');
    expect(formDataResult.get('prop7.prop7[4].prop2')).to.equal('bar');
  });

  it('should convert an array of objects with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false,
      prop7: [{
        prop1: 'test',
        prop2: 2,
        prop3: null,
        prop4: undefined,
        prop5: true,
        prop6: false
      }, {
        prop1: 'another_test',
        prop2: 3,
        prop3: null,
        prop4: undefined,
        prop5: false,
        prop6: true
      }]
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop7[0].prop1')).to.equal('test');
    expect(formDataResult.get('prop7[0].prop2')).to.equal('2');
    expect(formDataResult.get('prop7[0].prop5')).to.equal('1');
    expect(formDataResult.get('prop7[0].prop6')).to.equal('0');

    expect(formDataResult.get('prop7[1].prop1')).to.equal('another_test');
    expect(formDataResult.get('prop7[1].prop2')).to.equal('3');
    expect(formDataResult.get('prop7[1].prop5')).to.equal('0');
    expect(formDataResult.get('prop7[1].prop6')).to.equal('1');
  });

  it('should use the showLeafArrayIndexes option to hide leaf array indexes with useDotSeparator', function () {

    let testObject = {
      prop1: [
        [11, 'test', true, false]
      ],
      prop2: {
        prop3: [
          [11, 'test', true, false]
        ]
      }
    };

    let formDataResult = window.jsonToFormData(testObject, {showLeafArrayIndexes: false, useDotSeparator: true});

    expect(formDataResult.getAll('prop1[0][]')[0]).to.equal('11');
    expect(formDataResult.getAll('prop1[0][]')[1]).to.equal('test');
    expect(formDataResult.getAll('prop1[0][]')[2]).to.equal('1');
    expect(formDataResult.getAll('prop1[0][]')[3]).to.equal('0');

    expect(formDataResult.getAll('prop2.prop3[0][]')[0]).to.equal('11');
    expect(formDataResult.getAll('prop2.prop3[0][]')[1]).to.equal('test');
    expect(formDataResult.getAll('prop2.prop3[0][]')[2]).to.equal('1');
    expect(formDataResult.getAll('prop2.prop3[0][]')[3]).to.equal('0');
  });

  it('should support custom value mappings with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false
    };

    let options = {
      useDotSeparator: true,
      mapping: function (value) {
        if (value === null) {
          return 'foo';
        }
        if (typeof value === 'undefined') {
          return 'bar';
        }
        if (value === true) {
          return 0;
        }
        if (value === false) {
          return 1;
        }
        return value;
      }
    };

    let formDataResult = window.jsonToFormData(testObject, options);

    expect(formDataResult.get('prop1')).to.equal('test');
    expect(formDataResult.get('prop2')).to.equal('2');
    expect(formDataResult.get('prop3')).to.equal('foo');
    expect(formDataResult.get('prop4')).to.equal('bar');
    expect(formDataResult.get('prop5')).to.equal('0');
    expect(formDataResult.get('prop6')).to.equal('1');
  });

  it('should exclude null and undefined values from custom value mappings with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false
    };

    let options = {
      useDotSeparator: true,
      mapping: function (value) {
        if (value === true) {
          return undefined;
        }
        if (value === false) {
          return null;
        }
        return value;
      }
    };

    let formDataResult = window.jsonToFormData(testObject, options);

    expect(formDataResult.get('prop1')).to.equal('test');
    expect(formDataResult.get('prop2')).to.equal('2');
    expect(formDataResult.has('prop3')).to.equal(false);
    expect(formDataResult.has('prop4')).to.equal(false);
    expect(formDataResult.has('prop5')).to.equal(false);
    expect(formDataResult.has('prop6')).to.equal(false);
  });

  it('should include null values when specified by options with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false
    };

    let options = {
      useDotSeparator: true,
      includeNullValues: true
    };

    let formDataResult = window.jsonToFormData(testObject, options);

    expect(formDataResult.get('prop1')).to.equal('test');
    expect(formDataResult.get('prop2')).to.equal('2');
    expect(formDataResult.get('prop3')).to.equal('null');
    expect(formDataResult.has('prop4')).to.equal(false);
    expect(formDataResult.get('prop5')).to.equal('1');
    expect(formDataResult.get('prop6')).to.equal('0');
  });

  it('should include null values when specified by options and returned by custom mapping with useDotSeparator', function () {

    let testObject = {
      prop1: 'test',
      prop2: 2,
      prop3: null,
      prop4: undefined,
      prop5: true,
      prop6: false
    };

    let options = {
      includeNullValues: true,
      useDotSeparator: true,
      mapping: function (value) {
        if (value === 'test') {
          return null;
        }
        return value;
      }
    };

    let formDataResult = window.jsonToFormData(testObject, options);

    expect(formDataResult.get('prop1')).to.equal('null');
    expect(formDataResult.get('prop2')).to.equal('2');
    expect(formDataResult.get('prop3')).to.equal('null');
    expect(formDataResult.has('prop4')).to.equal(false);
    expect(formDataResult.get('prop5')).to.equal('true');
    expect(formDataResult.get('prop6')).to.equal('false');
  });

  it('should convert a nested object containing a file with useDotSeparator', function () {

    let file = new Blob(['file contents'], {type: 'text/plain'});
    file.name = "filename.txt";

    let testObject = {
      department: {
        main_image: {
          image: file,
          name: 'some name',
          meta_tag: 'some tag'
        },
        title: 'some title',
        subtitle: 'some sub title',
        meta_tag: 'some meta tag',
        meta_description: 'some meta description',
        slug: 'some slug',
        published: true
      }
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('department.main_image.image').name).to.equal('filename.txt');
    expect(formDataResult.get('department.main_image.image').type).to.equal('text/plain');
    expect(formDataResult.get('department.main_image.name')).to.equal('some name');
    expect(formDataResult.get('department.main_image.meta_tag')).to.equal('some tag');
    expect(formDataResult.get('department.title')).to.equal('some title');
    expect(formDataResult.get('department.subtitle')).to.equal('some sub title');
    expect(formDataResult.get('department.meta_tag')).to.equal('some meta tag');
    expect(formDataResult.get('department.meta_description')).to.equal('some meta description');
    expect(formDataResult.get('department.slug')).to.equal('some slug');
    expect(formDataResult.get('department.published')).to.equal('1');
  });

  it('should convert a date object to an ISO date formatted string with useDotSeparator', function () {

    let testObject = {
      prop1: new Date('05 January 2020 16:52:00 GMT')
    };

    let formDataResult = window.jsonToFormData(testObject, {useDotSeparator: true});

    expect(formDataResult.get('prop1')).to.equal('2020-01-05T16:52:00.000Z');
  });

  it('should append data to an existing form data object with useDotSeparator', function () {

    let testObject = {
      prop1: 'foo'
    };

    let initialFormData = new FormData();
    initialFormData.append('prop2', 'bar');

    let formDataResult = window.jsonToFormData(testObject, {initialFormData: initialFormData, useDotSeparator: true});

    expect(formDataResult.get('prop1')).to.equal('foo');
    expect(formDataResult.get('prop2')).to.equal('bar');
  });

  it('should override data on initial form data object with useDotSeparator', function () {

    let testObject = {
      prop1: 'foo',
      prop2: 'bar'
    };

    let initialFormData = new FormData();
    initialFormData.append('prop1', 'baz');

    let formDataResult = window.jsonToFormData(testObject, {initialFormData: initialFormData, useDotSeparator: true});

    expect(formDataResult.get('prop1')).to.equal('baz');
    expect(formDataResult.get('prop2')).to.equal('bar');
  });
});
