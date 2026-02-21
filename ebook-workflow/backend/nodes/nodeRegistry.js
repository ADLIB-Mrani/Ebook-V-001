/**
 * Node Registry
 * Manages all available workflow nodes
 */
class NodeRegistry {
  constructor() {
    this.nodes = new Map();
    this.registerBuiltInNodes();
  }

  /**
   * Register a node type
   */
  register(nodeType, nodeClass) {
    this.nodes.set(nodeType, nodeClass);
  }

  /**
   * Get a node executor
   */
  getNode(nodeType) {
    return this.nodes.get(nodeType);
  }

  /**
   * Get all available node types
   */
  getAvailableNodes() {
    const nodeList = [];
    this.nodes.forEach((nodeClass, type) => {
      nodeList.push({
        type,
        name: nodeClass.name,
        description: nodeClass.description,
        category: nodeClass.category,
        inputs: nodeClass.inputs,
        outputs: nodeClass.outputs,
        config: nodeClass.config
      });
    });
    return nodeList;
  }

  /**
   * Register built-in nodes
   */
  registerBuiltInNodes() {
    this.register('trigger', require('./TriggerNode'));
    this.register('content_collector', require('./ContentCollectorNode'));
    this.register('text_generator', require('./TextGeneratorNode'));
    this.register('formatter', require('./FormatterNode'));
    this.register('pdf_generator', require('./PdfGeneratorNode'));
    this.register('email_sender', require('./EmailSenderNode'));
    this.register('storage', require('./StorageNode'));
  }
}

module.exports = new NodeRegistry();
