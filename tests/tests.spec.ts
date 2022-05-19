import chai from 'chai';
import chaiHttp from 'chai-http';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

chai.use(chaiHttp);
chai.use(deepEqualInAnyOrder);

const expect = chai.expect;
const should = chai.should();

const baseUrl: string = 'https://metadata-server-mock.herokuapp.com';
const endpoints = {
    base: '/',
    query: '/query',
    properties: '/properties/',
    metadata: '/metadata/',
}

const metadata: Array<string> = [
    '2048c7e09308f9138cef8f1a81733b72e601d016eea5eef759ff2933416d617a696e67436f696e',
    '919e8a1922aaa764b1d66407c6f62244e77081215f385b60a62091494861707079436f696e',
];

const wrongMetadata: string = '919e8a1922aaa764b1d66407c6f62f1a81733b72e601d016eea5eef759ff29d617a696e67436f696e';
const wrongProperty: string = 'wrongProperty';

const metadataListOfProperties: Array<string> = [
    'subject',
    'url',
    'name',
    'ticker',
    'decimals',
    'policy',
    'logo',
    'description'
];

let savedMetadata: any;
let savedMetadataKeys: any;
describe('Test metadata mock service', () => {


    before((done) => {
        console.log('Before tests start, touch service to start it');
        chai.request(baseUrl)
            .get(endpoints.base)
            .end((err, res) => {
                console.log('Service started');
                done();
            });
    });

    it('Service is Up', (done) => {
        chai.request(baseUrl)
            .get(endpoints.base)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // This endpoint doesn't seem to be working.
    it.skip('Query endpoint', (done) => {
        chai.request(baseUrl)
            .post(endpoints.query)
            .query({
                "subjects": ["789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e",
                    "789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1"]
            })
            .end((err, res) => {
                console.log(res.body);
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Get metadata', (done) => {
        chai.request(baseUrl)
            .get(endpoints.metadata + metadata[0])
            .end((err, res) => {

                expect(res).to.have.status(200);
                metadataListOfProperties.forEach((property) => {
                    expect(res.body).to.have.property(property);
                });

                savedMetadata = res.body;
                savedMetadataKeys = Object.keys(savedMetadata);
                console.log('Name on METADATA:')
                console.log(savedMetadata[savedMetadataKeys[2]]);

                console.log(savedMetadataKeys);

                done();
            });
    });

    it('Properties endpoint', (done) => {
        chai.request(baseUrl)
            .get(endpoints.metadata + metadata[0] + endpoints.properties + savedMetadataKeys[2])
            .end((err, res) => {
                console.log(res.body);
                expect(res).to.have.status(200);
                console.log('Name on PROPERTIES:')
                console.log(savedMetadata[savedMetadataKeys[2]]);
                expect(res.body).to.deep.equalInAnyOrder(savedMetadata[savedMetadataKeys[2]]);
                done();
            });
    });

    it('Wrong metadata', (done) => {
        // Error should responde with a regular 404 request with a json body
        chai.request(baseUrl)
            .get(endpoints.metadata + wrongMetadata)
            .end((err, res) => {
                expect(err).to.have.status(200);
                expect(err.rawResponse).to.contain('Requested subject');
                expect(err.rawResponse).to.contain(wrongMetadata);
                expect(err.rawResponse).to.contain('not found');
                done();
            });
    });

    it('Wrong properties', (done) => {
        // Error should responde with a regular 404 request with a json body
        chai.request(baseUrl)
            .get(endpoints.metadata + metadata[0] + endpoints.properties + wrongProperty)
            .end((err, res) => {
                expect(err).to.have.status(200);
                expect(err.rawResponse).to.contain('Requested property');
                expect(err.rawResponse).to.contain(wrongProperty);
                expect(err.rawResponse).to.contain('not found');
                done();
            });
    });

    


});