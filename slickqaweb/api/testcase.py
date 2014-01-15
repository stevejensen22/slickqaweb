__author__ = 'slambson'

from slickqaweb.app import app
from slickqaweb.model.testcase import Testcase
from slickqaweb.model.serialize import deserialize_that
from slickqaweb.model.query import queryFor
from flask import request, g
from .standardResponses import JsonResponse, read_request

# TODO: add error handling. Not sure how to handle that yet.
@app.route('/api/testcases')
def get_testcases():
    args = request.args
    if args.has_key('projectid'):
        args = args.to_dict()
        args['project.id'] = request.args['projectid']
        del args['projectid']
    return JsonResponse(queryFor(Testcase, args))

@app.route('/api/testcases/<testcase_id>')
def get_testcase_by_id(testcase_id):
    return JsonResponse(Testcase.objects(id=testcase_id).first())


@app.route('/api/testcases', methods=["POST"])
def add_testcase():
    new_tc = deserialize_that(read_request(), Testcase())
    if (new_tc.author is None or new_tc.author == "") and g.user is not None:
        new_tc.author = g.user.full_name
    new_tc.save()
    return JsonResponse(new_tc)

@app.route('/api/testcases/<testcase_id>', methods=["PUT"])
def update_testcase(testcase_id):
    orig = Testcase.objects(id=testcase_id).first()
    deserialize_that(read_request(), orig)
    orig.save()
    return JsonResponse(orig)
