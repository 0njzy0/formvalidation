TestSuite = $.extend({}, TestSuite, {
    Event: {
        onEmailValid: function(e, data) {
            $('#msg').html('TestSuite.Event.onEmailValid() called, ' + data.field + ' is valid');
        },

        onEmailInvalid: function(e, data) {
            $('#msg').html('TestSuite.Event.onEmailInvalid() called, ' + data.field + ' is invalid');
        },

        onEmailStatus: function(e, data) {
            $('#status').html('TestSuite.Event.onEmailStatus() called; status = ' + data.status);
        },

        onFormValid: function(e) {
            $('#msg').html('TestSuite.Event.onFormValid() called, form ' + $(e.target).attr('id') + ' is valid');
        },

        onFormInvalid: function(e) {
            $('#msg').html('TestSuite.Event.onFormInvalid() called, form ' + $(e.target).attr('id') + ' is invalid');
        }
    }
});

// ---
// Form events
// ---

function onFormValid(e) {
    $('#msg').html('form ' + $(e.target).attr('id') + ' is valid');
};

function onFormInvalid(e) {
    $('#msg').html('form ' + $(e.target).attr('id') + ' is invalid');
};

describe('event form attribute callback global', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm" data-fv-onsuccess="onFormValid" data-fv-onerror="onFormInvalid" >',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm is valid');
    });

    it('call data-fv-onerror', function() {
        this.$email.val('a@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm is invalid');
    });
});

describe('event form attribute callback namespace', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm" data-fv-onsuccess="TestSuite.Event.onFormValid" data-fv-onerror="TestSuite.Event.onFormInvalid" >',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onFormValid() called, form eventForm is valid');
    });

    it('call data-fv-onerror', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onFormInvalid() called, form eventForm is invalid');
    });
});

describe('event form trigger', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm')
            .bootstrapValidator()
            .on('success.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.fv event');
            })
            .on('error.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered error.form.fv event');
            });

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('trigger success.form.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm triggered success.form.fv event');
    });

    it('trigger error.form.fv', function() {
        this.$email.val('this is"not\\allowed@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm triggered error.form.fv event');
    });
});

describe('event form programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator({
            onSuccess: function(e) {
                $('#msg').html('onSuccess() called');
            },
            onError: function(e) {
                $('#msg').html('onError() called');
            }
        });

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('Abc.example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onError() called');
    });
});

// ---
// Field events
// ---

function onEmailValid(e, data) {
    $('#msg').html(data.field + ' is valid');
};

function onEmailInvalid(e, data) {
    $('#msg').html(data.field + ' is invalid');
};

function onEmailStatus(e, data) {
    $('#status').html(data.status);
};

describe('event field attribute callback global', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div id="status"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress data-fv-onsuccess="onEmailValid" data-fv-onerror="onEmailInvalid" data-fv-onstatus="onEmailStatus" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('email is valid');
        expect($('#status').html()).toEqual(this.fv.STATUS_VALID);
    });

    it('call data-fv-onerror', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('email is invalid');
        expect($('#status').html()).toEqual(this.fv.STATUS_INVALID);
    });
});

describe('event field attribute callback namespace', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div id="status"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress data-fv-onsuccess="TestSuite.Event.onEmailValid" data-fv-onerror="TestSuite.Event.onEmailInvalid" data-fv-onstatus="TestSuite.Event.onEmailStatus" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onEmailValid() called, email is valid');
        expect($('#status').html()).toEqual('TestSuite.Event.onEmailStatus() called; status = ' + this.fv.STATUS_VALID);
    });

    it('call data-fv-onerror', function() {
        this.$email.val('a"b(c)d,e:f;gi[j\\k]l@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onEmailInvalid() called, email is invalid');
        expect($('#status').html()).toEqual('TestSuite.Event.onEmailStatus() called; status = ' + this.fv.STATUS_INVALID);
    });
});

describe('event field trigger', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm')
            .bootstrapValidator()
            .on('success.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.fv on ' + data.field);
            })
            .on('error.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered error.field.fv on ' + data.field);
            });

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('trigger success.field.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered success.field.fv on email');
    });

    it('trigger error.field.fv', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered error.field.fv on email');
    });
});

describe('event field programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator({
            fields: {
                email: {
                    onSuccess: function(e, data) {
                        $('#msg').html('onSuccess() called');
                    },
                    onError: function(e, data) {
                        $('#msg').html('onError() called');
                    }
                }
            }
        });

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('this is"not\\allowed@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onError() called');
    });
});

// ---
// Modifying default events
// ---

describe('event form trigger with default events', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm1">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm1')
            .bootstrapValidator()
            .on('bv.form.success', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered bv.form.success event');
            })
            .on('success.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.fv event');
            })
            .on('bv.form.error', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered bv.form.error event');
            })
            .on('error.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered error.form.fv event');
            });

        this.fv     = $('#eventForm1').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm1').bootstrapValidator('destroy').remove();
    });

    it('does not trigger bv.form.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('form eventForm1 triggered bv.form.success event');
    });

    it('triggers success.form.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm1 triggered success.form.fv event');
    });

    it('does not trigger bv.form.error', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('form eventForm1 triggered bv.form.error event');
    });

    it('triggers error.form.fv', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm1 triggered error.form.fv event');
    });
});

describe('event field trigger with default events', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm3">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm3')
            .bootstrapValidator()
            .on('success.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.fv on ' + data.field);
            })
            .on('error.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered error.field.fv on ' + data.field);
            })
            .on('bv.field.success', '[name="email"]', function(e, data) {
                $('#msg').html('triggered bv.field.success on ' + data.field);
            })
            .on('bv.field.error', '[name="email"]', function(e, data) {
                $('#msg').html('triggered bv.field.error on ' + data.field);
            });

        this.fv     = $('#eventForm3').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm3').bootstrapValidator('destroy').remove();
    });

    it('triggers success.field.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered success.field.fv on email');
    });

    it('does not trigger bv.field.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered bv.field.success on email');
    });

    it('does not trigger error.field.fv', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered error.field.fv on email');
    });

    it('triggers bv.field.error', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered bv.field.error on email');
    });
});

describe('event form trigger with events changed', function() {
    var defaultOptions = FormValidation.DEFAULT_OPTIONS;

    beforeEach(function() {
        FormValidation.DEFAULT_OPTIONS = $.extend({}, FormValidation.DEFAULT_OPTIONS, {
            events: {
                formInit: 'init.form.fv',
                formError: 'bv.form.error',
                formSuccess: 'bv.form.success',
                fieldAdded: 'added.field.fv',
                fieldRemoved: 'removed.field.fv',
                fieldInit: 'init.field.fv',
                fieldError: 'bv.field.error',
                fieldSuccess: 'bv.field.success',
                fieldStatus: 'status.field.fv',
                validatorError: 'bv.validator.error',
                validatorSuccess: 'success.validator.fv'
            }
        });

        $([
            '<form class="form-horizontal" id="eventForm2">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm2')
            .bootstrapValidator()
            .on('bv.form.success', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered bv.form.success event');
            })
            .on('success.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.fv event');
            })
            .on('bv.form.error', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered bv.form.error event');
            })
            .on('error.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered error.form.fv event');
            });

        this.fv     = $('#eventForm2').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm2').bootstrapValidator('destroy').remove();
        FormValidation.DEFAULT_OPTIONS = defaultOptions;
    });

    it('triggers bv.form.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm2 triggered bv.form.success event');
    });

    it('does not trigger success.form.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('form eventForm2 triggered success.form.fv event');
    });

    it('triggers bv.form.error', function() {
        spyOn(window, 'onerror');

        this.$email.val('this is"not\\allowed@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm2 triggered bv.form.error event');

        expect(window.onerror).not.toHaveBeenCalled();
    });
});

describe('event field trigger with events changed', function() {
    var defaultOptions = FormValidation.DEFAULT_OPTIONS;

    beforeEach(function() {
        FormValidation.DEFAULT_OPTIONS = $.extend({}, FormValidation.DEFAULT_OPTIONS, {
            events: {
                formInit: 'init.form.fv',
                formError: 'bv.form.error',
                formSuccess: 'bv.form.success',
                fieldAdded: 'added.field.fv',
                fieldRemoved: 'removed.field.fv',
                fieldInit: 'init.field.fv',
                fieldError: 'bv.field.error',
                fieldSuccess: 'bv.field.success',
                fieldStatus: 'status.field.fv',
                validatorError: 'bv.validator.error',
                validatorSuccess: 'success.validator.fv'
            }
        });

        $([
            '<form class="form-horizontal" id="eventForm4">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm4')
            .bootstrapValidator()
            .on('success.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.fv on ' + data.field);
            })
            .on('error.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered error.field.fv on ' + data.field);
            })
            .on('bv.field.success', '[name="email"]', function(e, data) {
                $('#msg').html('triggered bv.field.success on ' + data.field);
            })
            .on('bv.field.error', '[name="email"]', function(e, data) {
                $('#msg').html('triggered bv.field.error on ' + data.field);
            });

        this.fv     = $('#eventForm4').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm4').bootstrapValidator('destroy').remove();
        FormValidation.DEFAULT_OPTIONS = defaultOptions;
    });

    it('triggers success.field.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered success.field.fv on email');
    });

    it('does not trigger bv.field.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered bv.field.success on email');
    });

    it('does not trigger error.field.fv', function() {
        this.$email.val('Abc.example.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered error.field.fv on email');
    });

    it('triggers bv.field.error', function() {
        spyOn(window, 'onerror');

        this.$email.val('Abc.example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered bv.field.error on email');

        expect(window.onerror).not.toHaveBeenCalled();
    });
});

// ---
// Validator events
// ---

function onEmailAddressValidatorSuccess(e, data) {
    $('#msg').html(data.validator + ' validator passed');
};

function onEmailAddressValidatorError(e, data) {
    $('#msg').html(data.validator + ' validator did not pass');
};

describe('event validator declarative', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress data-fv-emailaddress-onsuccess="onEmailAddressValidatorSuccess" data-fv-emailaddress-onerror="onEmailAddressValidatorError" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator();

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('trigger data-fv-emailaddress-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator passed');
    });

    it('trigger data-fv-emailaddress-onerror', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator did not pass');
    });
});

describe('event validator programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').bootstrapValidator({
            fields: {
                email: {
                    validators: {
                        emailAddress: {
                            onSuccess: function(e, data) {
                                $('#msg').html('emailAddress validator: onSuccess() called');
                            },
                            onError: function(e, data) {
                                $('#msg').html('emailAddress validator: onError() called');
                            },
                            message: 'The email address is not valid'
                        }
                    }
                }
            }
        });

        this.fv     = $('#eventForm').data('bootstrapValidator');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').bootstrapValidator('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator: onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator: onError() called');
    });
});
