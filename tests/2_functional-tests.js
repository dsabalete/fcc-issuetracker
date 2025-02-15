const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const newIssue = {
    issue_title: 'Title',
    issue_text: 'text',
    created_by: 'Functional Test - Every field',
    assigned_to: 'Chai and Mocha',
    status_text: 'In QA'
}

const createIssue = async (issue) => chai
    .request(server)
    .post('/api/issues/test')
    .send(issue)
    .then((res) => res.body._id);

suite('Functional Tests', function () {
    suite('POST /api/issues/{project}', function () {
        test('Create an issue with every field', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(res.body.created_by, 'Functional Test - Every field');
                    assert.equal(res.body.assigned_to, 'Chai and Mocha');
                    assert.equal(res.body.status_text, 'In QA');
                    done();
                });
        });

        test('Create an issue with only required fields', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(res.body.created_by, 'Functional Test - Required fields');
                    done();
                });
        });

        test('Create an issue with missing required fields', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });
    });

    suite('GET /api/issues/{project}', function () {
        test('View issues on a project', function (done) {
            chai.request(server)
                .get('/api/issues/test')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });

        test('View issues on a project with one filter', function (done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({ created_by: 'Functional Test - Required fields' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.equal(issue.created_by, 'Functional Test - Required fields');
                    });
                    done();
                });
        });

        test('View issues on a project with multiple filters', function (done) {
            chai.request(server)
                .get('/api/issues/test')
                .query({ created_by: 'Functional Test - Required fields', issue_title: 'Title' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.equal(issue.created_by, 'Functional Test - Required fields');
                        assert.equal(issue.issue_title, 'Title');
                    });
                    done();
                });
        });
    });

    suite('PUT /api/issues/{project}', function () {
        test('Update one field on an issue', async function () {
            let issueId = await createIssue(newIssue)

            return chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: issueId,
                    fieldsToUpdate: {
                        issue_title: 'Updated Title'
                    }
                })
                .then(function (res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, issueId);
                });
        });

        test('Update multiple fields on an issue', async function () {
            let issueId = await createIssue(newIssue)

            return chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: issueId,
                    fieldsToUpdate: {
                        issue_title: 'Updated Title',
                        issue_text: 'Updated text'
                    }
                })
                .then(function (res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully updated');
                    assert.equal(res.body._id, issueId);
                });
        });

        test('Update an issue with missing _id', function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    fieldsToUpdate: {
                        issue_title: 'Updated Title'
                    }
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('Update an issue with no fields to update', function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: 'valid_id'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'no update field(s) sent');
                    done();
                });
        });

        test('Update an issue with an invalid _id', function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: 'invalid_id',
                    fieldsToUpdate: {
                        issue_title: 'Updated Title'
                    }
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not update');
                    done();
                });
        });
    });

    suite('DELETE /api/issues/{project}', function () {
        test('Delete an issue', async function () {
            let issueId = await createIssue(newIssue)

            return chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: issueId
                })
                .then(function (res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, issueId);
                });
        });

        test('Delete an issue with an invalid _id', function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: 'invalid_id'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, 'invalid_id');
                    done();
                });
        });

        test('Delete an issue with missing _id', function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
    });
});