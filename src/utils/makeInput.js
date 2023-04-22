exports.makeInput = (template, jobName) => {
  return template.replace('{jobName}', jobName);
};
