import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/business_logo.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';

class Avatar extends StatelessWidget {
  const Avatar({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      height: 213,
      width: 213,
      child: DecoratedBox(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: AppColor.textBusinessGradient,
        ),
        child: BusinessLogo(
          height: 150,
          width: 150,
          large: false,
        ),
      ),
    );
  }
}
