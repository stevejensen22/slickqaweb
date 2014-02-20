from mongoengine import *
from .testrun import Testrun
from .testrunSummary import TestrunSummary, ResultsByStatus
from .serialize import serializable


class TestrunGroup(Document):
    name = StringField()
    created = DateTimeField()
    testruns = ListField(ReferenceField(Testrun, dbref=True))
    grouptype = StringField(default="PARALLEL", choices=["SERIAL", "PARALLEL"])
    meta = {'collection': 'testrungroups'}

    def dynamic_fields(self):
        return {
            'state': self.state(),
            'groupSummary': self.groupSummary
        }

    @serializable
    def state(self):
        """The state of the testrun group is the "lowest" state of all it's testruns."""
        retval = "FINISHED"
        for testrun in self.testruns:
            assert isinstance(testrun, Testrun)
            if testrun.state == "TO_BE_RUN":
                return "TO_BE_RUN" # lowest possible state, return immediately
            elif testrun.state == "RUNNING":
                retval = "RUNNING" # we don't have to worry about overwriting lower state TO_BE_RUN
        return retval

    @serializable
    def groupSummary(self):
        """Return a summary of all the testruns in the group."""
        retval = TestrunSummary()
        retval.resultsByStatus = ResultsByStatus()
        for run in self.testruns:
            for status in run.summary.statusListOrdered():
                setattr(retval.resultsByStatus, status, getattr(retval.resultsByStatus, status) + getattr(run.summary.resultsByStatus, status))
        return retval

