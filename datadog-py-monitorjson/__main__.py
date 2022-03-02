import pulumi
import pulumi_datadog as datadog
import json

monitor_json = datadog.MonitorJson("monitorJson", monitor=json.dumps({
    "name": "Example monitor - service check",
    "type": "service check",
    "query": "\"ntp.in_sync\".by(\"*\").last(2).count_by_status()",
    "message": "Change the message triggers if any host's clock goes out of sync with the time given by NTP. The offset threshold is configured in the Agent's 'ntp.yaml' file.\n\nSee [Troubleshooting NTP Offset issues](https://docs.datadoghq.com/agent/troubleshooting/ntp for more details on cause and resolution.",
    "tags": [],
    "multi": True,
    "options": {
        "include_tags": True,
        "locked": False,
        "new_host_delay": 150,
        "notify_audit": False,
        "notify_no_data": False,
        "thresholds": {
            "warning": 1,
            "ok": 1,
            "critical": 1
        }
    },
    "priority": 1,
    "classification": "custom"
})
)

pulumi.export("monitor_json_name", monitor_json.id)