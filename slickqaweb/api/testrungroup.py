__author__ = 'Jared Jorgensen'

from slickqaweb.app import app
from slickqaweb.model.testrunGroup import TestrunGroup
from slickqaweb.model.testrun import Testrun
from slickqaweb.model.serialize import deserialize_that
from slickqaweb.model.query import queryFor
from flask import request, g
from .standardResponses import JsonResponse, read_request
from bson import ObjectId

# TODO: add error handling. Not sure how to handle that yet.
@app.route('/api/testrungroups')
def get_testrungroups():
    return JsonResponse(queryFor(TestrunGroup))

@app.route('/api/testrungroups/<testrungroup_id>')
def get_testrungroup_by_id(testrungroup_id):
    return JsonResponse(TestrunGroup.objects(id=testrungroup_id).first())


@app.route('/api/testrungroups', methods=["POST"])
def add_testrungroup():
    new_trg = deserialize_that(read_request(), TestrunGroup())
    new_trg.save()
    return JsonResponse(new_trg)

@app.route('/api/testrungroups/<testrungroup_id>', methods=["PUT"])
def update_testrungroup(testrungroup_id):
    orig = TestrunGroup.objects(id=testrungroup_id).first()
    deserialize_that(read_request(), orig)
    orig.save()
    return JsonResponse(orig)

@app.route('/api/testrungroups/<testrungroup_id>', methods=["DELETE"])
def delete_testrungroup(testrungroup_id):
    orig = TestrunGroup.objects(id=testrungroup_id).first()
    orig.delete()
    return JsonResponse(orig)

# --------------- For backwards compatibility -------------------------------

@app.route('/api/testrungroups/<testrungroup_id>/addtestrun/<testrun_id>', methods=["POST"])
def add_testrun_to_testrun_group(testrungroup_id, testrun_id):
    orig = TestrunGroup.objects(id=ObjectId(testrungroup_id)).first()
    testrun = Testrun.objects(id=ObjectId(testrun_id)).first()
    if (not hasattr(orig, 'testruns')) or orig.testruns is None:
        orig.testruns = []
    orig.testruns.append(testrun)
    orig.save()
    return JsonResponse(orig)
