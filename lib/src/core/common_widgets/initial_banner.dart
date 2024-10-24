import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/localization/l10n.dart';

class InitialBanner extends StatelessWidget {
  const InitialBanner({super.key});

  @override
  Widget build(BuildContext context) {
    final wellcomeTo = context.l10n.initialBannerTitle;
    return SliverToBoxAdapter(
      child: Container(
        height: Sizes.p48,
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: AppColor.textBusinessGradient,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 30),
        alignment: Alignment.center,
        child: FittedBox(
          child: Text(
            '$wellcomeTo ${BusinessInformation.websiteType}',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
        ),
      ),
    );
  }
}
