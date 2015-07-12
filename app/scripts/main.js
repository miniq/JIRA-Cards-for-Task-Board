(function (document) {
    'use strict';

    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function () {
        console.log('Our app is ready to rock!');
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function () {
        // imports are loaded and elements have been registered
        app.createReferencesForUserSettings();
        app.loadUserOptions();
    });

    // Close drawer after menu item is selected if drawerPanel is narrow
    app.onMenuSelect = function () {
        let drawerPanel = document.querySelector('#paperDrawerPanel');
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

    app.getJIRAIssues = function () {
        let scrumCardsContainer = app.$['scrum-cards-container'].$,
            url = app.$['JIRA-URL-address'].value,
            project = app.$['JIRA-project'].value,
            version = app.$['JIRA-project-version'].value,
            AJAXForJIRAIssues = document.querySelector('#ajax-for-issues');

        AJAXForJIRAIssues.url = url + '/rest/api/2/search?jql=project=' + project + '+and+fixVersion=' + version + '&&maxResults=500';

        AJAXForJIRAIssues.generateRequest();
    };

    app.onJIRAIssuesRequest = function () {
        document.querySelector('#ajax-spinner').active = true;
    };

    app.onJIRAIssuesResponse = function () {
        document.querySelector('#ajax-spinner').active = false;
    };

    ////////////////////////////////////////////////////////////
    // Extension storage
    ////////////////////////////////////////////////////////////

    /**
     * Create needed reference for data binding and loading user settings
     */
    app.createReferencesForUserSettings = function () {
        this.scrumCardSettings = {
            issueType: Object.create(null),
            issueKey: Object.create(null),
            parentName: Object.create(null),
            parentKey: Object.create(null),
            issuePriority: Object.create(null),
            issueFixVersions: Object.create(null),
            issueSummary: Object.create(null),
            issueDescription: Object.create(null),
            issueAssignee: Object.create(null)
        }
    };

    app.loadUserOptions = function () {
        chrome.storage.sync.get('settings', function (object) {

            if (object.settings.ajax === undefined && object.settings.scrumCard === undefined) {
                return;
            }

            var ajax = object.settings.ajax;
            var scrumCard = object.settings.scrumCard;

            app.URLAddress = ajax.url;
            app.project = ajax.project;
            app.projectVersion = ajax.version;

            app.scrumCardSettings = {
                issueType: {
                    isBold: scrumCard.issueType.isBold,
                    isVisible: scrumCard.issueType.isVisible
                },
                issueKey: {
                    isBold: scrumCard.issueKey.isBold,
                    isVisible: scrumCard.issueKey.isVisible
                },
                parentName: {
                    isBold: scrumCard.parentName.isBold,
                    isVisible: scrumCard.parentName.isVisible
                },
                parentKey: {
                    isBold: scrumCard.parentKey.isBold,
                    isVisible: scrumCard.parentKey.isVisible
                },
                issuePriority: {
                    isBold: scrumCard.issuePriority.isBold,
                    isVisible: scrumCard.issuePriority.isVisible
                },
                issueFixVersions: {
                    isBold: scrumCard.issueFixVersions.isBold,
                    isVisible: scrumCard.issueFixVersions.isVisible
                },
                issueSummary: {
                    isBold: scrumCard.issueSummary.isBold,
                    isVisible: scrumCard.issueSummary.isVisible
                },
                issueDescription: {
                    isBold: scrumCard.issueDescription.isBold,
                    isVisible: scrumCard.issueDescription.isVisible
                },
                issueAssignee: {
                    isBold: scrumCard.issueAssignee.isBold,
                    isVisible: scrumCard.issueAssignee.isVisible
                }
            };

            document.querySelector('#options-loaded').show();
        });
    };

    app.saveUserOptions = function () {
        var scrumCardSettings = app.scrumCardSettings;

        var optionsToBeSaved = {
            settings: {
                ajax: {
                    url: app.URLAddress || 'https://sapjira.wdf.sap.corp/',
                    project: app.project || 'BGSOFUIRODOPI',
                    version: app.projectVersion || '101511'
                },
                scrumCard: {
                    issueType: {
                        isBold: scrumCardSettings.issueType.isBold,
                        isVisible: scrumCardSettings.issueType.isVisible
                    },
                    issueKey: {
                        isBold: scrumCardSettings.issueKey.isBold,
                        isVisible: scrumCardSettings.issueKey.isVisible
                    },
                    parentName: {
                        isBold: scrumCardSettings.parentName.isBold,
                        isVisible: scrumCardSettings.parentName.isVisible
                    },
                    parentKey: {
                        isBold: scrumCardSettings.parentKey.isBold,
                        isVisible: scrumCardSettings.parentKey.isVisible
                    },
                    issuePriority: {
                        isBold: scrumCardSettings.issuePriority.isBold,
                        isVisible: scrumCardSettings.issuePriority.isVisible
                    },
                    issueFixVersions: {
                        isBold: scrumCardSettings.issueFixVersions.isBold,
                        isVisible: scrumCardSettings.issueFixVersions.isVisible
                    },
                    issueSummary: {
                        isBold: scrumCardSettings.issueSummary.isBold,
                        isVisible: scrumCardSettings.issueSummary.isVisible
                    },
                    issueDescription: {
                        isBold: scrumCardSettings.issueDescription.isBold,
                        isVisible: scrumCardSettings.issueDescription.isVisible
                    },
                    issueAssignee: {
                        isBold: scrumCardSettings.issueAssignee.isBold,
                        isVisible: scrumCardSettings.issueAssignee.isVisible
                    }
                }
            }
        };

        chrome.storage.sync.set(optionsToBeSaved, function () {
            document.querySelector('#options-saved').show();
        });
    };

})(document);
