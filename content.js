// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'modifyPrices') {
    const result = modifyAllPrices(request.operation, request.amount);
    sendResponse(result);
  } else if (request.action === 'debugInputs') {
    const result = debugInputs();
    sendResponse(result);
  }
  return true; // 保持消息通道开启
});

/**
 * 批量修改页面上所有折扣价格
 * @param {string} operation - 操作类型: 'increase' 或 'decrease'
 * @param {number} amount - 调整金额
 */
function modifyAllPrices(operation, amount) {
  try {
    // 多种选择器策略，以适应不同的页面结构
    const selectors = [
      'input.eds-input__input[type="text"]',  // 原始选择器
      'input[type="text"].eds-input__input',  // 变体1
      'input.shopee-input__input',            // Shopee常用类名
      'input[placeholder=""][type="text"]',   // 根据截图中的placeholder
      'input[data-v-7fcfdf7e]',              // 带Vue data属性
      'td input[type="text"]',                // 表格中的输入框
      'input[type="text"]'                    // 通用文本输入框
    ];
    
    let priceInputs = [];
    
    // 尝试所有选择器
    for (const selector of selectors) {
      const inputs = document.querySelectorAll(selector);
      if (inputs.length > 0) {
        priceInputs = Array.from(inputs);
        console.log(`使用选择器找到 ${inputs.length} 个输入框: ${selector}`);
        break;
      }
    }
    
    // 如果还是没找到，尝试更智能的方式
    if (priceInputs.length === 0) {
      const allInputs = document.querySelectorAll('input[type="text"]');
      priceInputs = Array.from(allInputs).filter(input => {
        const value = input.value.trim();
        // 只选择包含数字的输入框
        return value && !isNaN(value) && parseFloat(value) > 0;
      });
      console.log(`通过智能筛选找到 ${priceInputs.length} 个价格输入框`);
    }
    
    let foundCount = 0;
    let modifiedCount = 0;

    priceInputs.forEach((input) => {
      // 获取当前输入框的值
      const currentValue = input.value.trim();
      
      // 检查是否是有效的数字
      if (currentValue && !isNaN(currentValue)) {
        const currentPrice = parseFloat(currentValue);
        
        // 过滤掉不太可能是价格的值（比如太小的数字）
        if (currentPrice >= 1) {
          foundCount++;
          
          let newPrice;

          // 根据操作类型计算新价格
          if (operation === 'increase') {
            newPrice = currentPrice + amount;
          } else if (operation === 'decrease') {
            newPrice = currentPrice - amount;
            // 确保价格不为负数
            if (newPrice < 0) {
              newPrice = 0;
            }
          }

          // 保留两位小数
          newPrice = Math.round(newPrice * 100) / 100;

          // 更新输入框的值
          const oldValue = input.value;
          input.value = newPrice.toString();

          // 触发多种事件以确保页面检测到变化
          ['input', 'change', 'blur', 'keyup'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
          });
          
          // 尝试触发Vue的更新
          if (input._vModifiers || input.__v_model) {
            const vueEvent = new CustomEvent('input', { 
              bubbles: true, 
              cancelable: true,
              detail: { value: newPrice.toString() }
            });
            input.dispatchEvent(vueEvent);
          }

          // 添加视觉反馈 - 保持绿色背景不消失
          input.style.backgroundColor = '#dcfce7';
          input.style.borderColor = '#10b981';
          input.style.borderWidth = '2px';

          modifiedCount++;
          
          console.log(`价格修改: ${oldValue} -> ${newPrice} (${input.className})`);
        }
      }
    });

    return {
      success: true,
      found: foundCount,
      modified: modifiedCount,
      message: `找到 ${foundCount} 个价格输入框，成功修改 ${modifiedCount} 个`
    };

  } catch (error) {
    console.error('修改价格时出错:', error);
    return {
      success: false,
      found: 0,
      modified: 0,
      message: '修改失败: ' + error.message
    };
  }
}

/**
 * 调试函数：显示页面上所有输入框的信息
 */
function debugInputs() {
  const allInputs = document.querySelectorAll('input[type="text"]');
  console.log('=== 页面输入框调试信息 ===');
  console.log(`总共找到 ${allInputs.length} 个文本输入框`);
  
  const debugInfo = [];
  allInputs.forEach((input, index) => {
    const info = {
      index: index,
      value: input.value,
      className: input.className,
      id: input.id,
      name: input.name,
      placeholder: input.placeholder,
      isPrice: !isNaN(input.value.trim()) && parseFloat(input.value.trim()) > 0
    };
    debugInfo.push(info);
    console.log(`Input ${index}:`, info);
  });
  
  return {
    success: true,
    total: allInputs.length,
    inputs: debugInfo
  };
}

// 页面加载完成后的初始化
console.log('虾皮价格批量修改器已加载');
console.log('提示：打开控制台可以查看详细的调试信息');
