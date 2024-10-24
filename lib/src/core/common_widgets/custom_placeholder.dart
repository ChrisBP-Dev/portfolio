import 'package:flutter/material.dart';

class CustomPlaceholder extends StatelessWidget {
  const CustomPlaceholder({
    required this.viewName,
    this.height,
    super.key,
    this.width,
  });
  final String viewName;
  final double? height;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        border: Border.all(
          color: color,
        ),
      ),
      alignment: Alignment.center,
      child: Text(
        viewName,
        style: TextStyle(
          color: color,
        ),
      ),
    );
  }
}
