import chai from 'chai';
import chaiHttp from 'chai-http';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

import endpoints from '../fixtures/endpoints';
import metadata from '../fixtures/metadata';
import wrongMetadata from '../fixtures/wrongMetadata';
import wrongProperty from '../fixtures/wrongProperty';
import metadataListOfProperties from '../fixtures/metadataListOfProperties';



chai.use(chaiHttp);
chai.use(deepEqualInAnyOrder);

const expect = chai.expect;
const should = chai.should();



let savedMetadata: any;
let savedMetadataKeys: any;

describe('Test metadata mock service', () => {


    before((done) => {
        //this.timeout(10000); // This should be enough time to load the mock service, disabled because of TS compilation errors.
        console.log('Before tests start, touch service to start it');
        chai.request(endpoints.baseUrl)
            .get(endpoints.home)
            .end((err, res) => {
                console.log('Service started');
                done();
            });
    });

    it('Service is Up', (done) => {
        chai.request(endpoints.baseUrl)
            .get(endpoints.home)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Query endpoint - subjects exist', (done) => {
        let property = metadataListOfProperties[0] + 's';
        const body: { [k: string]: any } = {};
        body[property] = [metadata[0]];


        chai.request(endpoints.baseUrl)
            .post(endpoints.query)
            .send(body)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property(metadataListOfProperties[0] + 's');
                expect(res.body.subjects).to.be.an('array');
                expect(res.body.subjects).to.have.lengthOf(1);
                done();
            });
    });

    it('Query endpoint - no subjects exist', (done) => {
        chai.request(endpoints.baseUrl)
            .post(endpoints.query)
            .send({
                "subjects": ["789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e",
                    "789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1"]
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property(metadataListOfProperties[0] + 's');
                expect(res.body.subjects).to.be.an('array');
                expect(res.body.subjects).to.have.lengthOf(0);
                done();
            });
    });

    it('Get metadata - Contains all properties', (done) => {
        chai.request(endpoints.baseUrl)
            .get(endpoints.metadata + metadata[0])
            .end((err, res) => {

                expect(res).to.have.status(200);
                metadataListOfProperties.forEach((property) => {
                    expect(res.body).to.have.property(property);
                });

                savedMetadata = res.body;
                savedMetadataKeys = Object.keys(savedMetadata);

                done();
            });
    });

    it('Properties endpoint - Get a property', (done) => {
        chai.request(endpoints.baseUrl)
            .get(endpoints.metadata + metadata[0] + endpoints.properties + savedMetadataKeys[2])
            .end((err, res) => {

                expect(res).to.have.status(200);
                expect(res.body).to.deep.equalInAnyOrder(savedMetadata[savedMetadataKeys[2]]);
                done();
            });
    });

    it('Wrong metadata', (done) => {
        // Error should responde with a regular 404 request with a json body
        chai.request(endpoints.baseUrl)
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
        chai.request(endpoints.baseUrl)
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