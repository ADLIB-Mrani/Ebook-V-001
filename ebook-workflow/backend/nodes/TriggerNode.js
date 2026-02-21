/**
 * Trigger Node
 * Starting point of workflow execution
 */
class TriggerNode {
  static name = 'Déclencheur';
  static description = 'Point de départ du workflow';
  static category = 'trigger';
  static inputs = [];
  static outputs = ['data'];
  static config = [
    {
      name: 'triggerType',
      type: 'select',
      label: 'Type de déclenchement',
      options: [
        { value: 'manual', label: 'Manuel' },
        { value: 'schedule', label: 'Programmé' },
        { value: 'webhook', label: 'Webhook' }
      ],
      default: 'manual'
    }
  ];

  static async execute(config, inputs, context) {
    return {
      timestamp: new Date().toISOString(),
      triggerType: config.triggerType || 'manual',
      data: context.triggerData || {}
    };
  }
}

module.exports = TriggerNode;
